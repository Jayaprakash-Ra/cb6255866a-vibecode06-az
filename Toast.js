import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext();

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);

    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, removeAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast functionality
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, removeAllToasts } = context;

  return {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    remove: removeToast,
    removeAll: removeAllToasts
  };
};

// Toast Container Component
const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '400px'
    }}>
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onRemove={onRemove} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual Toast Component
const ToastItem = ({ toast, onRemove }) => {
  const getToastStyles = (type) => {
    const baseStyles = {
      background: 'white',
      border: '1px solid',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      minWidth: '300px',
      maxWidth: '400px'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          borderColor: '#10b981',
          borderLeftWidth: '4px'
        };
      case 'error':
        return {
          ...baseStyles,
          borderColor: '#ef4444',
          borderLeftWidth: '4px'
        };
      case 'warning':
        return {
          ...baseStyles,
          borderColor: '#f59e0b',
          borderLeftWidth: '4px'
        };
      default:
        return {
          ...baseStyles,
          borderColor: '#3b82f6',
          borderLeftWidth: '4px'
        };
    }
  };

  const getIcon = (type) => {
    const iconProps = { style: { fontSize: '20px', flexShrink: 0 } };
    
    switch (type) {
      case 'success':
        return <FaCheckCircle {...iconProps} style={{ ...iconProps.style, color: '#10b981' }} />;
      case 'error':
        return <FaExclamationTriangle {...iconProps} style={{ ...iconProps.style, color: '#ef4444' }} />;
      case 'warning':
        return <FaExclamationTriangle {...iconProps} style={{ ...iconProps.style, color: '#f59e0b' }} />;
      default:
        return <FaInfoCircle {...iconProps} style={{ ...iconProps.style, color: '#3b82f6' }} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={getToastStyles(toast.type)}
    >
      {getIcon(toast.type)}
      
      <div style={{ flex: 1 }}>
        <p style={{ 
          margin: 0, 
          fontSize: '14px', 
          lineHeight: '1.4',
          color: '#374151'
        }}>
          {toast.message}
        </p>
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          color: '#6b7280',
          transition: 'color 0.2s',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.target.style.color = '#374151'}
        onMouseLeave={(e) => e.target.style.color = '#6b7280'}
      >
        <FaTimes style={{ fontSize: '12px' }} />
      </button>
    </motion.div>
  );
};

export default ToastProvider; 