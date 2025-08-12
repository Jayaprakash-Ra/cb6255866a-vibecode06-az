import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaSpinner } from 'react-icons/fa';
import { useApp, actionTypes } from '../../contexts/AppContext';
import { useToast } from '../common/Toast';

const AdminLogin = ({ onLoginSuccess, onCancel }) => {
  const { dispatch } = useApp();
  const toast = useToast();
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Admin credentials
  const ADMIN_CREDENTIALS = {
    username: 'Admin_123',
    password: 'Admin@123'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific errors
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateCredentials = () => {
    const newErrors = {};
    
    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!credentials.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    if (credentials.username.trim() && credentials.username !== ADMIN_CREDENTIALS.username) {
      newErrors.username = 'Invalid username';
    }
    
    if (credentials.password.trim() && credentials.password !== ADMIN_CREDENTIALS.password) {
      newErrors.password = 'Invalid password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateCredentials()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials
      if (credentials.username === ADMIN_CREDENTIALS.username && 
          credentials.password === ADMIN_CREDENTIALS.password) {
        
        // Update user context to admin
        const adminUser = {
          id: 'admin-001',
          name: 'Administrator',
          role: 'admin',
          points: 0,
          permissions: ['view_reports', 'resolve_incidents', 'manage_schedules', 'view_analytics'],
          loginTime: new Date().toISOString()
        };
        
        dispatch({
          type: actionTypes.SET_USER,
          payload: adminUser
        });
        
        // Store admin session
        localStorage.setItem('adminSession', JSON.stringify({
          user: adminUser,
          timestamp: new Date().toISOString(),
          sessionId: `admin-session-${Date.now()}`
        }));
        
        toast.success('🎉 Admin login successful! Welcome, Administrator.', 5000);
        
        if (onLoginSuccess) {
          onLoginSuccess(adminUser);
        }
        
      } else {
        setErrors({
          general: 'Invalid credentials. Please check your username and password.'
        });
        toast.error('❌ Login failed. Please check your credentials.');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: 'Login failed. Please try again.'
      });
      toast.error('❌ Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin(e);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="login-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            width: '100%',
            maxWidth: '400px',
            margin: '1rem'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaCrown size={32} color="white" />
            </motion.div>
            <h2 style={{ 
              color: '#1f2937', 
              marginBottom: '0.5rem',
              fontSize: '1.8rem',
              fontWeight: '700'
            }}>
              Admin Login
            </h2>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '1rem',
              margin: 0
            }}>
              Sign in to access administrative features
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  color: '#991b1b',
                  fontSize: '0.875rem',
                  textAlign: 'center'
                }}
              >
                {errors.general}
              </motion.div>
            )}

            {/* Username Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter admin username"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    border: `2px solid ${errors.username ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '10px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    background: isLoading ? '#f9fafb' : 'white',
                    cursor: isLoading ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (!errors.username) {
                      e.target.style.borderColor = '#3b82f6';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.username) {
                      e.target.style.borderColor = '#e5e7eb';
                    }
                  }}
                />
              </div>
              {errors.username && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem',
                  margin: '0.25rem 0 0 0'
                }}>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <FaLock />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter admin password"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 3rem 0.75rem 2.5rem',
                    border: `2px solid ${errors.password ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '10px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    background: isLoading ? '#f9fafb' : 'white',
                    cursor: isLoading ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (!errors.password) {
                      e.target.style.borderColor = '#3b82f6';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.password) {
                      e.target.style.borderColor = '#e5e7eb';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem',
                  margin: '0.25rem 0 0 0'
                }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="submit"
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: isLoading 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="spinning" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    Sign In
                  </>
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Cancel
              </motion.button>
            </div>
          </form>

          {/* Credential Hint */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#fffbeb',
            border: '1px solid #fbbf24',
            borderRadius: '8px',
            fontSize: '0.8rem'
          }}>
            <p style={{ 
              margin: 0, 
              color: '#92400e',
              textAlign: 'center'
            }}>
              <strong>Demo Credentials:</strong><br />
              Username: Admin_123<br />
              Password: Admin@123
            </p>
          </div>
        </motion.div>
      </motion.div>

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
    </AnimatePresence>
  );
};

export default AdminLogin; 