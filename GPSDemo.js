import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from '../../services/locationService';
import { 
  FaMapMarkerAlt, 
  FaCrosshairs, 
  FaSpinner, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';

const GPSDemo = () => {
  const { 
    locationData, 
    isLoading, 
    error, 
    getCurrentLocation, 
    clearLocation, 
    isSupported 
  } = useLocation();
  
  const [selectedAccuracy, setSelectedAccuracy] = useState('balanced');

  const handleGetLocation = async () => {
    try {
      await getCurrentLocation(selectedAccuracy);
    } catch (err) {
      console.error('Location error:', err);
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ 
          color: '#1f2937', 
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <FaMapMarkerAlt style={{ color: '#3b82f6' }} />
          GPS Location Demo
        </h2>
        <p style={{ color: '#6b7280' }}>
          Test the enhanced GPS location features with different accuracy levels
        </p>
      </div>

      {/* Support Status */}
      <div style={{
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        background: isSupported ? '#ecfdf5' : '#fef2f2',
        border: `1px solid ${isSupported ? '#10b981' : '#ef4444'}`
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          color: isSupported ? '#065f46' : '#991b1b'
        }}>
          {isSupported ? <FaCheckCircle /> : <FaExclamationTriangle />}
          <strong>
            GPS Status: {isSupported ? 'Supported' : 'Not Supported'}
          </strong>
        </div>
        <p style={{ 
          margin: '0.5rem 0 0 0', 
          fontSize: '0.875rem',
          color: isSupported ? '#047857' : '#7f1d1d'
        }}>
          {isSupported 
            ? 'Your browser supports geolocation services.' 
            : 'Geolocation is not available in this browser.'
          }
        </p>
      </div>

      {/* Accuracy Selector */}
      <div style={{
        padding: '1rem',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        marginBottom: '1.5rem'
      }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '600',
          color: '#374151'
        }}>
          GPS Accuracy Level:
        </label>
        <select
          value={selectedAccuracy}
          onChange={(e) => setSelectedAccuracy(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            background: 'white',
            fontSize: '1rem'
          }}
        >
          <option value="highAccuracy">🎯 High Accuracy (Emergency) - Best precision, uses more battery</option>
          <option value="balanced">⚖️ Balanced (Recommended) - Good precision, moderate battery usage</option>
          <option value="lowPower">🔋 Low Power (General) - Lower precision, saves battery</option>
        </select>
      </div>

      {/* Get Location Button */}
      <motion.button
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        onClick={handleGetLocation}
        disabled={isLoading || !isSupported}
        style={{
          width: '100%',
          padding: '1rem',
          background: isLoading 
            ? '#9ca3af' 
            : selectedAccuracy === 'highAccuracy' 
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : selectedAccuracy === 'balanced'
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                : 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: isLoading || !isSupported ? 'not-allowed' : 'pointer',
          fontSize: '1.1rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}
      >
        {isLoading ? (
          <>
            <FaSpinner className="spinning" />
            Getting Location...
          </>
        ) : (
          <>
            <FaCrosshairs />
            Get My Location
          </>
        )}
      </motion.button>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '1rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: '#991b1b',
            marginBottom: '0.5rem'
          }}>
            <FaExclamationTriangle />
            <strong>Location Error</strong>
          </div>
          <p style={{ margin: 0, color: '#7f1d1d', fontSize: '0.875rem' }}>
            {error}
          </p>
        </motion.div>
      )}

      {/* Location Results */}
      {locationData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '12px',
            padding: '1.5rem'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            color: '#0c4a6e'
          }}>
            <FaMapMarkerAlt />
            <strong>Location Retrieved Successfully!</strong>
          </div>

          {/* Coordinates */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e' }}>📍 Coordinates:</h4>
            <div style={{ 
              fontFamily: 'monospace', 
              background: 'white',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #0ea5e9'
            }}>
              <div>Latitude: {locationData.coordinates.lat.toFixed(6)}</div>
              <div>Longitude: {locationData.coordinates.lng.toFixed(6)}</div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                DMS: {locationData.formatted.dms}
              </div>
            </div>
          </div>

          {/* Accuracy */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e' }}>🎯 Accuracy:</h4>
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              background: locationData.accuracy <= 10 
                ? '#dcfce7' 
                : locationData.accuracy <= 50 
                  ? '#fef3c7' 
                  : '#fee2e2',
              color: locationData.accuracy <= 10 
                ? '#166534' 
                : locationData.accuracy <= 50 
                  ? '#92400e' 
                  : '#991b1b',
              border: `1px solid ${locationData.accuracy <= 10 
                ? '#16a34a' 
                : locationData.accuracy <= 50 
                  ? '#d97706' 
                  : '#dc2626'}`,
              fontWeight: '600'
            }}>
              ±{locationData.accuracy}m {
                locationData.accuracy <= 10 
                  ? '(Excellent)' 
                  : locationData.accuracy <= 50 
                    ? '(Good)' 
                    : '(Fair)'
              }
            </div>
          </div>

          {/* Address */}
          {locationData.address && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e' }}>🏠 Address:</h4>
              <div style={{
                background: 'white',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #0ea5e9'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  {locationData.address.shortAddress}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                  {locationData.address.fullAddress}
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e' }}>ℹ️ Additional Info:</h4>
            <div style={{ fontSize: '0.875rem', color: '#475569' }}>
              <div>Timestamp: {new Date(locationData.timestamp).toLocaleString()}</div>
              {locationData.altitude && (
                <div>Altitude: {locationData.altitude}m</div>
              )}
              {locationData.heading && (
                <div>Heading: {locationData.heading.toFixed(1)}°</div>
              )}
              {locationData.speed && (
                <div>Speed: {(locationData.speed * 3.6).toFixed(1)} km/h</div>
              )}
            </div>
          </div>

          {/* Clear Button */}
          <button
            onClick={clearLocation}
            style={{
              padding: '0.5rem 1rem',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Clear Location
          </button>
        </motion.div>
      )}

      {/* Info Box */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#fffbeb',
        border: '1px solid #f59e0b',
        borderRadius: '8px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#92400e',
          marginBottom: '0.5rem'
        }}>
          <FaInfoCircle />
          <strong>How it works:</strong>
        </div>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '1.5rem',
          color: '#78350f',
          fontSize: '0.875rem'
        }}>
          <li>📱 Uses browser's built-in GPS and Wi-Fi positioning</li>
          <li>🎯 Different accuracy levels for different use cases</li>
          <li>🗺️ Automatic address lookup using OpenStreetMap</li>
          <li>📊 Shows accuracy radius and additional sensor data</li>
          <li>💾 Stores last known location for faster access</li>
        </ul>
      </div>

      <style>
        {`
          .spinning {
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default GPSDemo; 