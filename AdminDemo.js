import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp, actionTypes } from '../../contexts/AppContext';
import { FaCrown, FaTicketAlt, FaPlus, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { addSampleReports } from '../../data/sampleReports';
import AdminLogin from '../Auth/AdminLogin';

const AdminDemo = () => {
  const { state, dispatch } = useApp();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleAdminLogin = () => {
    setShowAdminLogin(true);
  };

  const handleLoginSuccess = (adminUser) => {
    setShowAdminLogin(false);
  };

  const handleLoginCancel = () => {
    setShowAdminLogin(false);
  };

  const handleAddSampleTickets = () => {
    addSampleReports(dispatch, actionTypes);
    alert('✅ Sample tickets added! Check the Admin Panel to manage them.');
  };

  const handleResolveTicket = (reportId) => {
    dispatch({
      type: actionTypes.UPDATE_REPORT,
      payload: { 
        id: reportId, 
        status: 'Resolved', 
        resolvedAt: new Date().toISOString() 
      }
    });
    
    // Award points
    dispatch({
      type: actionTypes.ADD_POINTS,
      payload: 15
    });

    alert(`🎉 Ticket ${reportId} resolved! User awarded 15 points.`);
  };

  const activeReports = state.reports.filter(r => r.status !== 'Resolved');
  const isAdmin = state.user.role === 'admin';

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ 
          color: '#1f2937', 
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <FaCrown style={{ color: '#f59e0b' }} />
          Admin Login Demo
        </h2>
        <p style={{ color: '#6b7280' }}>
          Demonstrate admin authentication and ticket management
        </p>
      </div>

      {/* Current Status */}
      <div style={{
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        background: isAdmin ? '#ecfdf5' : '#f8fafc',
        border: `2px solid ${isAdmin ? '#10b981' : '#e2e8f0'}`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          color: isAdmin ? '#065f46' : '#374151'
        }}>
          <FaCrown />
          <strong>Current Status:</strong>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ margin: 0, color: isAdmin ? '#047857' : '#6b7280' }}>
            User: <strong>{state.user.name}</strong><br />
            Role: <strong>{isAdmin ? 'Administrator' : 'Regular User'}</strong><br />
            Points: <strong>{state.user.points}</strong>
          </p>
        </div>

        {!isAdmin && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdminLogin}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaCrown />
            Login as Admin
          </motion.button>
        )}
      </div>

      {/* Credentials Info */}
      <div style={{
        padding: '1rem',
        background: '#fffbeb',
        border: '1px solid #fbbf24',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#92400e',
          marginBottom: '0.5rem'
        }}>
          <FaInfoCircle />
          <strong>Admin Credentials:</strong>
        </div>
        <p style={{ 
          margin: 0, 
          color: '#78350f',
          fontFamily: 'monospace',
          fontSize: '0.9rem'
        }}>
          Username: <strong>Admin_123</strong><br />
          Password: <strong>Admin@123</strong>
        </p>
      </div>

      {/* Sample Data Section */}
      <div style={{
        padding: '1.5rem',
        background: '#f8fafc',
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          <FaTicketAlt />
          Sample Tickets
        </h3>
        
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          Add sample tickets to test the admin functionality:
        </p>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddSampleTickets}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FaPlus />
          Add 5 Sample Tickets
        </motion.button>
      </div>

      {/* Active Tickets Display */}
      {activeReports.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            <FaTicketAlt />
            Active Tickets ({activeReports.length})
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {activeReports.slice(0, 3).map(report => (
              <div
                key={report.id}
                style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>
                    {report.id}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {report.description.substring(0, 60)}...
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    📍 {report.location}
                  </div>
                </div>
                
                {isAdmin && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleResolveTicket(report.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <FaCheckCircle />
                    Resolve
                  </motion.button>
                )}
              </div>
            ))}
            {activeReports.length > 3 && (
              <div style={{ textAlign: 'center', color: '#6b7280' }}>
                ... and {activeReports.length - 3} more tickets
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        padding: '1.5rem',
        background: '#f0f9ff',
        border: '1px solid #0ea5e9',
        borderRadius: '12px'
      }}>
        <h3 style={{
          color: '#0c4a6e',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FaInfoCircle />
          How to Test Admin Functionality:
        </h3>
        <ol style={{ 
          margin: 0, 
          paddingLeft: '1.5rem',
          color: '#0c4a6e'
        }}>
          <li>Click "Login as Admin" and use the provided credentials</li>
          <li>Add sample tickets using the button above</li>
          <li>Navigate to the Admin Panel in the header to manage tickets</li>
          <li>Click "Mark Resolved" on any ticket to close it and award points</li>
          <li>Watch the points counter increase when tickets are resolved</li>
        </ol>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin 
          onLoginSuccess={handleLoginSuccess}
          onCancel={handleLoginCancel}
        />
      )}
    </div>
  );
};

export default AdminDemo; 