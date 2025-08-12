import React, { useState, useRef } from 'react';
import { useApp, actionTypes } from '../../contexts/AppContext';
import { FaCamera, FaMapMarkerAlt, FaTrash, FaExclamationTriangle, FaSpinner, FaCrosshairs } from 'react-icons/fa';
import { useLocation } from '../../services/locationService';
import './ReportForm.css';

const ReportForm = ({ onSubmit }) => {
  const { dispatch } = useApp();
  const fileInputRef = useRef(null);
  const { locationData, isLoading: locationLoading, getCurrentLocation, isSupported } = useLocation();
  
  const [formData, setFormData] = useState({
    type: 'full',
    description: '',
    location: '',
    photo: null,
    coordinates: null
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [locationAccuracy, setLocationAccuracy] = useState('balanced');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, photo: 'File size must be less than 5MB' }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, photo: event.target.result }));
        setErrors(prev => ({ ...prev, photo: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getLocation = async () => {
    try {
      const location = await getCurrentLocation(locationAccuracy, true);
      
      setFormData(prev => ({
        ...prev,
        coordinates: location.coordinates,
        location: location.address ? location.address.shortAddress || location.formatted.decimal : location.formatted.decimal
      }));
      
      setErrors(prev => ({ ...prev, location: '' }));
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        location: error.message || 'Unable to get location. Please enter manually.' 
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const reportId = `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const report = {
      id: reportId,
      ...formData,
      status: 'Reported',
      timestamp: new Date().toISOString(),
      escalationTime: null
    };
    
    dispatch({
      type: actionTypes.ADD_REPORT,
      payload: report
    });
    
    // Reset form
    setFormData({
      type: 'full',
      description: '',
      location: '',
      photo: null,
      coordinates: null
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (onSubmit) onSubmit(report);
  };

  return (
    <div className="report-form">
      <div className="form-header">
        <h2>Report Bin Issue</h2>
        <p>Help us maintain clean neighborhoods by reporting bin issues</p>
      </div>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Issue Type</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="full"
                checked={formData.type === 'full'}
                onChange={handleInputChange}
              />
              <span className="radio-icon">🗑️</span>
              <span>Bin Full</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="damaged"
                checked={formData.type === 'damaged'}
                onChange={handleInputChange}
              />
              <span className="radio-icon">⚠️</span>
              <span>Bin Damaged</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the issue in detail..."
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            rows="4"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Photo (Optional)</label>
          <div className="photo-upload">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="file-input"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="photo-button"
            >
              <FaCamera />
              {formData.photo ? 'Change Photo' : 'Take Photo'}
            </button>
            {formData.photo && (
              <div className="photo-preview">
                <img src={formData.photo} alt="Preview" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photo: null }))}
                  className="remove-photo"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
          {errors.photo && <span className="error-message">{errors.photo}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          
          {/* Location Accuracy Selector */}
          <div className="accuracy-selector">
            <label className="accuracy-label">GPS Accuracy:</label>
            <select 
              value={locationAccuracy} 
              onChange={(e) => setLocationAccuracy(e.target.value)}
              className="accuracy-select"
            >
              <option value="highAccuracy">High Accuracy (Emergency)</option>
              <option value="balanced">Balanced (Recommended)</option>
              <option value="lowPower">Low Power (General)</option>
            </select>
          </div>

          <div className="location-input">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter address or coordinates"
              className={`form-input ${errors.location ? 'error' : ''}`}
            />
            <div className="location-buttons">
              <button
                type="button"
                onClick={getLocation}
                disabled={locationLoading || !isSupported}
                className={`location-button ${locationAccuracy}`}
                title={!isSupported ? 'GPS not supported in this browser' : `Get location with ${locationAccuracy} accuracy`}
              >
                {locationLoading ? (
                  <>
                    <FaSpinner className="spinning" />
                    Getting...
                  </>
                ) : (
                  <>
                    <FaCrosshairs />
                    Use GPS
                  </>
                )}
              </button>
              
              {locationData && (
                <div className="location-info">
                  <small>
                    📍 Accuracy: ±{locationData.accuracy}m
                    {locationData.address && (
                      <span className="address-preview">
                        <br />📍 {locationData.address.fullAddress}
                      </span>
                    )}
                  </small>
                </div>
              )}
            </div>
          </div>
          {errors.location && <span className="error-message">{errors.location}</span>}
          
          {/* Location Status */}
          {formData.coordinates && (
            <div className="location-status">
              <span className="coordinates">
                📍 {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
              </span>
              {locationData && locationData.accuracy && (
                <span className={`accuracy-badge ${
                  locationData.accuracy <= 10 ? 'high' : 
                  locationData.accuracy <= 50 ? 'medium' : 'low'
                }`}>
                  ±{locationData.accuracy}m
                </span>
              )}
            </div>
          )}
        </div>

        <button type="submit" className="submit-button">
          <FaExclamationTriangle />
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportForm; 