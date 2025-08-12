import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBell, 
  FaCheckCircle, 
  FaCoins, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
  FaEye,
  FaTrash,
  FaFilter
} from 'react-icons/fa';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { useToast } from '../common/Toast';

const NotificationCenter = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, incident, points
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Load notifications on component mount
  useEffect(() => {
    if (userId) {
      loadNotifications();
      // Set up real-time updates (if using WebSocket)
      setupRealTimeUpdates();
    }
  }, [userId]);

  // Update unread count when notifications change
  useEffect(() => {
    const unread = notifications.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // In real app, this would fetch from API
      // For demo, using localStorage
      const storedNotifications = JSON.parse(
        localStorage.getItem(`notifications_${userId}`) || '[]'
      );
      
      // Add sample notifications if none exist
      if (storedNotifications.length === 0) {
        const sampleNotifications = generateSampleNotifications();
        localStorage.setItem(`notifications_${userId}`, JSON.stringify(sampleNotifications));
        setNotifications(sampleNotifications);
      } else {
        setNotifications(storedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Check for new notifications (in real app, this would be WebSocket)
      checkForNewNotifications();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  };

  const checkForNewNotifications = async () => {
    try {
      // Simulate API call to check for new notifications
      // In real implementation, this would be handled by WebSocket or Server-Sent Events
      const latestNotifications = JSON.parse(
        localStorage.getItem(`notifications_${userId}`) || '[]'
      );
      
      const currentIds = notifications.map(n => n.id);
      const newNotifications = latestNotifications.filter(n => !currentIds.includes(n.id));
      
      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
        // Show toast for new notifications
        newNotifications.forEach(notification => {
          if (notification.type === 'INCIDENT_RESOLVED') {
            toast.success(`🎉 ${notification.title}`, 5000);
          }
        });
      }
    } catch (error) {
      console.error('Error checking for new notifications:', error);
    }
  };

  const generateSampleNotifications = () => {
    return [
      {
        id: 'notif-1',
        type: 'INCIDENT_RESOLVED',
        title: 'Incident Resolved - Points Awarded!',
        message: 'Your report (RPT-1699123456-ABC123) has been resolved. You\'ve earned 25 points for helping keep our community clean!',
        data: {
          incidentId: 'RPT-1699123456-ABC123',
          pointsAwarded: 25,
          incidentType: 'damaged',
          location: 'Main Street & 5th Ave'
        },
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        priority: 'normal'
      },
      {
        id: 'notif-2',
        type: 'POINTS_EARNED',
        title: 'Points Earned!',
        message: 'You earned 15 points for reporting a full bin. Thanks for keeping our city clean!',
        data: {
          pointsAwarded: 15,
          action: 'incident-report',
          location: 'Central Park'
        },
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        priority: 'low'
      },
      {
        id: 'notif-3',
        type: 'INCIDENT_ESCALATED',
        title: 'Incident Escalated',
        message: 'Your report has been escalated to priority status. We\'re working on it urgently.',
        data: {
          incidentId: 'RPT-1699123456-XYZ789',
          incidentType: 'emergency'
        },
        isRead: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        priority: 'high'
      }
    ];
  };

  const markAsRead = async (notificationId) => {
    try {
      const updatedNotifications = notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      setNotifications(updatedNotifications);
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updatedNotifications);
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      setNotifications(updatedNotifications);
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'incident':
        return notification.type.includes('INCIDENT');
      case 'points':
        return notification.type.includes('POINTS');
      default:
        return true;
    }
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'INCIDENT_RESOLVED':
        return <FaCheckCircle style={{ color: '#10b981' }} />;
      case 'POINTS_EARNED':
        return <FaCoins style={{ color: '#f59e0b' }} />;
      case 'INCIDENT_ESCALATED':
        return <FaExclamationTriangle style={{ color: '#ef4444' }} />;
      default:
        return <FaInfoCircle style={{ color: '#3b82f6' }} />;
    }
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  };

  return (
    <div className="notification-center">
      {/* Notification Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <FaBell style={{ fontSize: '1.5rem', color: '#6b7280' }} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb',
              width: '400px',
              maxHeight: '600px',
              zIndex: 1000,
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #e5e7eb',
              background: '#f9fafb'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1f2937' }}>
                  Notifications
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    color: '#6b7280'
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              {/* Filter Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['all', 'unread', 'incident', 'points'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '16px',
                      background: filter === filterType ? '#3b82f6' : 'white',
                      color: filter === filterType ? 'white' : '#6b7280',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {filterType}
                  </button>
                ))}
              </div>

              {/* Actions */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {loading ? (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  Loading notifications...
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <FaBell style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }} />
                  <p>No notifications found</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    getIcon={getNotificationIcon}
                    formatTime={formatNotificationTime}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Individual Notification Item Component
const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  getIcon, 
  formatTime 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        padding: '1rem',
        borderBottom: '1px solid #f3f4f6',
        background: notification.isRead ? 'white' : '#fef3c7',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
    >
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {/* Icon */}
        <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>
          {getIcon(notification.type)}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '0.25rem'
          }}>
            <h4 style={{
              margin: 0,
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#1f2937',
              lineHeight: '1.2'
            }}>
              {notification.title}
            </h4>
            <span style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              flexShrink: 0,
              marginLeft: '0.5rem'
            }}>
              {formatTime(notification.createdAt)}
            </span>
          </div>

          <p style={{
            margin: 0,
            fontSize: '0.8rem',
            color: '#4b5563',
            lineHeight: '1.4'
          }}>
            {notification.message}
          </p>

          {/* Additional Data */}
          {notification.data && notification.data.pointsAwarded && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: '#ecfdf5',
              borderRadius: '6px',
              border: '1px solid #10b981',
              fontSize: '0.75rem'
            }}>
              <span style={{ color: '#059669', fontWeight: '600' }}>
                🎉 +{notification.data.pointsAwarded} points earned!
              </span>
              {notification.data.location && (
                <div style={{ color: '#065f46', marginTop: '0.25rem' }}>
                  📍 {notification.data.location}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}
            >
              {!notification.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                  title="Mark as read"
                >
                  <FaEye />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
                title="Delete"
              >
                <FaTrash />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Unread Indicator */}
      {!notification.isRead && (
        <div style={{
          position: 'absolute',
          left: '0.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '4px',
          height: '60%',
          background: '#3b82f6',
          borderRadius: '2px'
        }} />
      )}
    </motion.div>
  );
};

export default NotificationCenter; 