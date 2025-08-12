// Service Worker for SMART Bin App
const CACHE_NAME = 'smart-bin-v1.0.0';
const STATIC_CACHE = 'smart-bin-static-v1.0.0';
const RUNTIME_CACHE = 'smart-bin-runtime-v1.0.0';

// Assets to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  // Add other critical assets
];

// Routes that should work offline
const OFFLINE_FALLBACK_ROUTES = [
  '/',
  '/report',
  '/schedule',
  '/education',
  '/rewards'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Serve cached version or offline fallback
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline page
              return caches.match('/');
            });
        })
    );
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache GET requests
          if (request.method === 'GET' && response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // For offline, try to serve from cache
          if (request.method === 'GET') {
            return caches.match(request);
          }
          
          // For POST/PUT requests, store in IndexedDB for later sync
          if (request.method === 'POST' || request.method === 'PUT') {
            return storeOfflineAction(request)
              .then(() => {
                return new Response(
                  JSON.stringify({ 
                    success: true, 
                    offline: true,
                    message: 'Action saved for when you\'re back online' 
                  }),
                  { 
                    status: 200, 
                    headers: { 'Content-Type': 'application/json' } 
                  }
                );
              });
          }
          
          return new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
      })
  );
});

// Store offline actions in IndexedDB
async function storeOfflineAction(request) {
  const data = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: await request.text(),
    timestamp: Date.now()
  };

  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open('SmartBinOffline', 1);
    
    dbRequest.onerror = () => reject(dbRequest.error);
    
    dbRequest.onsuccess = () => {
      const db = dbRequest.result;
      const transaction = db.transaction(['actions'], 'readwrite');
      const store = transaction.objectStore('actions');
      
      store.add(data);
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
    
    dbRequest.onupgradeneeded = () => {
      const db = dbRequest.result;
      if (!db.objectStoreNames.contains('actions')) {
        const store = db.createObjectStore('actions', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// Listen for online event to sync offline actions
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_OFFLINE_ACTIONS') {
    syncOfflineActions();
  }
});

// Sync offline actions when back online
async function syncOfflineActions() {
  try {
    const actions = await getOfflineActions();
    
    for (const action of actions) {
      try {
        const response = await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });
        
        if (response.ok) {
          await removeOfflineAction(action.id);
          console.log('Synced offline action:', action.url);
        }
      } catch (error) {
        console.error('Failed to sync action:', error);
      }
    }
  } catch (error) {
    console.error('Failed to sync offline actions:', error);
  }
}

// Get offline actions from IndexedDB
function getOfflineActions() {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open('SmartBinOffline', 1);
    
    dbRequest.onsuccess = () => {
      const db = dbRequest.result;
      const transaction = db.transaction(['actions'], 'readonly');
      const store = transaction.objectStore('actions');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    };
    
    dbRequest.onerror = () => reject(dbRequest.error);
  });
}

// Remove synced action from IndexedDB
function removeOfflineAction(id) {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open('SmartBinOffline', 1);
    
    dbRequest.onsuccess = () => {
      const db = dbRequest.result;
      const transaction = db.transaction(['actions'], 'readwrite');
      const store = transaction.objectStore('actions');
      
      store.delete(id);
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
    
    dbRequest.onerror = () => reject(dbRequest.error);
  });
} 