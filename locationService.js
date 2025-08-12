// GPS Location Service - Comprehensive location handling with enhanced features
import React from 'react';
import { useToast } from '../components/common/Toast';

class LocationService {
  constructor() {
    this.currentPosition = null;
    this.watchId = null;
    this.isWatching = false;
    this.lastKnownLocation = this.getStoredLocation();
    
    // Location options for different accuracy needs
    this.locationOptions = {
      highAccuracy: {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minute
      },
      balanced: {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      },
      lowPower: {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 600000 // 10 minutes
      }
    };
  }

  // Check if geolocation is supported
  isGeolocationSupported() {
    return 'geolocation' in navigator;
  }

  // Check location permission status
  async checkPermissionStatus() {
    if (!('permissions' in navigator)) {
      return 'unsupported';
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
      console.warn('Permission API not supported:', error);
      return 'unsupported';
    }
  }

  // Get current location with enhanced error handling
  async getCurrentLocation(accuracy = 'balanced') {
    return new Promise((resolve, reject) => {
      if (!this.isGeolocationSupported()) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = this.locationOptions[accuracy] || this.locationOptions.balanced;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = this.processLocationData(position);
          this.currentPosition = locationData;
          this.storeLocation(locationData);
          resolve(locationData);
        },
        (error) => {
          const errorMessage = this.getLocationErrorMessage(error);
          console.error('Geolocation error:', error);
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  // Process raw location data into useful format
  processLocationData(position) {
    const { latitude, longitude, accuracy, altitude, heading, speed } = position.coords;
    const timestamp = new Date(position.timestamp);

    return {
      coordinates: {
        lat: latitude,
        lng: longitude
      },
      accuracy: Math.round(accuracy),
      altitude: altitude ? Math.round(altitude) : null,
      heading: heading,
      speed: speed,
      timestamp: timestamp.toISOString(),
      formatted: {
        decimal: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        dms: this.convertToDMS(latitude, longitude)
      }
    };
  }

  // Convert decimal degrees to degrees, minutes, seconds
  convertToDMS(lat, lng) {
    const convertDDToDMS = (dd, isLatitude) => {
      const direction = dd >= 0 ? (isLatitude ? 'N' : 'E') : (isLatitude ? 'S' : 'W');
      const absolute = Math.abs(dd);
      const degrees = Math.floor(absolute);
      const minutes = Math.floor((absolute - degrees) * 60);
      const seconds = Math.round(((absolute - degrees) * 60 - minutes) * 60 * 100) / 100;
      
      return `${degrees}°${minutes}'${seconds}"${direction}`;
    };

    return `${convertDDToDMS(lat, true)}, ${convertDDToDMS(lng, false)}`;
  }

  // Get human-readable error message
  getLocationErrorMessage(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied. Please enable location permissions in your browser settings.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable. Please check your internet connection.';
      case error.TIMEOUT:
        return 'Location request timed out. Please try again.';
      default:
        return 'An unknown error occurred while retrieving location.';
    }
  }

  // Watch position for continuous location updates
  async startWatchingLocation(callback, accuracy = 'balanced') {
    if (!this.isGeolocationSupported()) {
      throw new Error('Geolocation is not supported');
    }

    if (this.isWatching) {
      this.stopWatchingLocation();
    }

    const options = this.locationOptions[accuracy];

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = this.processLocationData(position);
        this.currentPosition = locationData;
        this.storeLocation(locationData);
        if (callback) callback(locationData);
      },
      (error) => {
        console.error('Watch position error:', error);
        if (callback) callback(null, this.getLocationErrorMessage(error));
      },
      options
    );

    this.isWatching = true;
    return this.watchId;
  }

  // Stop watching location
  stopWatchingLocation() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isWatching = false;
    }
  }

  // Store location in localStorage
  storeLocation(locationData) {
    try {
      localStorage.setItem('lastKnownLocation', JSON.stringify(locationData));
      this.lastKnownLocation = locationData;
    } catch (error) {
      console.warn('Failed to store location:', error);
    }
  }

  // Get stored location from localStorage
  getStoredLocation() {
    try {
      const stored = localStorage.getItem('lastKnownLocation');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to retrieve stored location:', error);
      return null;
    }
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degToRad(lat2 - lat1);
    const dLng = this.degToRad(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  // Get address from coordinates (reverse geocoding)
  async getAddressFromCoordinates(lat, lng) {
    try {
      // Using OpenStreetMap Nominatim API (free alternative to Google)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SMART-Bin-Tracker/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();
      
      if (data && data.display_name) {
        return {
          fullAddress: data.display_name,
          shortAddress: this.formatShortAddress(data.address),
          components: data.address
        };
      } else {
        return {
          fullAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          shortAddress: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          components: null
        };
      }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return {
        fullAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        shortAddress: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        components: null
      };
    }
  }

  // Format a short, readable address
  formatShortAddress(addressComponents) {
    if (!addressComponents) return '';

    const parts = [];
    
    // Add house number and road
    if (addressComponents.house_number && addressComponents.road) {
      parts.push(`${addressComponents.house_number} ${addressComponents.road}`);
    } else if (addressComponents.road) {
      parts.push(addressComponents.road);
    }
    
    // Add locality or city
    const locality = addressComponents.neighbourhood || 
                    addressComponents.suburb || 
                    addressComponents.city || 
                    addressComponents.town || 
                    addressComponents.village;
    
    if (locality) {
      parts.push(locality);
    }

    return parts.join(', ');
  }

  // Get location with address
  async getLocationWithAddress(accuracy = 'balanced') {
    try {
      const locationData = await this.getCurrentLocation(accuracy);
      const addressData = await this.getAddressFromCoordinates(
        locationData.coordinates.lat,
        locationData.coordinates.lng
      );

      return {
        ...locationData,
        address: addressData
      };
    } catch (error) {
      throw error;
    }
  }

  // Request location permission explicitly
  async requestLocationPermission() {
    try {
      const permissionStatus = await this.checkPermissionStatus();
      
      if (permissionStatus === 'granted') {
        return true;
      }
      
      // Try to get location (this will trigger permission request)
      await this.getCurrentLocation('lowPower');
      return true;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  // Get location accuracy level based on use case
  getRecommendedAccuracy(useCase) {
    switch (useCase) {
      case 'emergency':
      case 'navigation':
        return 'highAccuracy';
      case 'reporting':
      case 'checkin':
        return 'balanced';
      case 'weather':
      case 'general':
        return 'lowPower';
      default:
        return 'balanced';
    }
  }

  // Clean up resources
  cleanup() {
    this.stopWatchingLocation();
    this.currentPosition = null;
  }
}

// React hook for easy location access in components
export const useLocation = () => {
  const [locationData, setLocationData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const toast = useToast();

  const locationService = React.useMemo(() => new LocationService(), []);

  const getCurrentLocation = async (accuracy = 'balanced', showToast = true) => {
    setIsLoading(true);
    setError(null);

    try {
      const location = await locationService.getLocationWithAddress(accuracy);
      setLocationData(location);
      
      if (showToast) {
        toast.success('📍 Location obtained successfully!');
      }
      
      return location;
    } catch (err) {
      setError(err.message);
      
      if (showToast) {
        toast.error(`Location error: ${err.message}`);
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearLocation = () => {
    setLocationData(null);
    setError(null);
  };

  React.useEffect(() => {
    return () => {
      locationService.cleanup();
    };
  }, [locationService]);

  return {
    locationData,
    isLoading,
    error,
    getCurrentLocation,
    clearLocation,
    locationService,
    isSupported: locationService.isGeolocationSupported()
  };
};

export default new LocationService(); 