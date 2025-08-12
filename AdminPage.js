import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp, actionTypes } from '../contexts/AppContext';
import { FaCrown, FaCheckCircle, FaExclamationTriangle, FaClock, FaMapMarkerAlt, FaImage, FaComments, FaSave } from 'react-icons/fa';
import { useToast } from '../components/common/Toast';

const AdminPage = () => {
  const { state, dispatch } = useApp();
  const toast = useToast();
  
  // Comment state for tickets
  const [ticketComments, setTicketComments] = useState({});
  const [newComment, setNewComment] = useState({});

  // Comment handlers
  const handleAddComment = (reportId) => {
    const comment = newComment[reportId];
    if (comment && comment.trim()) {
      const updatedComments = {
        ...ticketComments,
        [reportId]: [
          ...(ticketComments[reportId] || []),
          {
            id: Date.now(),
            text: comment.trim(),
            author: 'Administrator',
            timestamp: new Date().toISOString()
          }
        ]
      };
      setTicketComments(updatedComments);
      setNewComment(prev => ({
        ...prev,
        [reportId]: ''
      }));
      toast.success('💬 Comment added successfully!');
    }
  };

  const handleResolveReport = (reportId) => {
    const report = state.reports.find(r => r.id === reportId);
    if (report) {
      const confirmed = window.confirm(
        `Are you sure you want to mark ticket ${reportId} as resolved?\n\nThis action will:\n• Close the ticket\n• Award 15 points to your account\n• Remove it from active tickets`
      );
      
      if (confirmed) {
        dispatch({
          type: actionTypes.UPDATE_REPORT,
          payload: { 
            id: reportId, 
            status: 'Resolved', 
            resolvedAt: new Date().toISOString(),
            resolvedBy: 'Administrator',
            adminComments: ticketComments[reportId] || []
          }
        });
        
        dispatch({
          type: actionTypes.ADD_POINTS,
          payload: 15
        });

        setTicketComments(prev => ({
          ...prev,
          [reportId]: []
        }));

        toast.success(`🎉 Ticket ${reportId} resolved successfully! You earned 15 points.`, 5000);
      }
    }
  };

  const activeReports = state.reports.filter(r => r.status !== 'Resolved');

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            textAlign: 'center',
            marginBottom: '3rem',
            color: 'white'
          }}
        >
          <h1 style={{ 
            fontSize: '3rem',
            margin: '0 0 1rem 0',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            <FaCrown style={{ color: '#fbbf24' }} />
            Admin Panel
          </h1>
          <p style={{ 
            fontSize: '1.2rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            opacity: 0.9
          }}>
            Manage and resolve tickets with comments - Available to all users!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: '#1f2937',
              margin: 0,
              fontSize: '1.8rem'
            }}>
              <FaExclamationTriangle style={{ color: '#f59e0b' }} />
              Active Tickets ({activeReports.length})
            </h2>
            {activeReports.length === 0 && (
              <span style={{ 
                color: '#10b981', 
                fontWeight: '600',
                background: '#ecfdf5',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                border: '2px solid #10b981',
                fontSize: '1rem'
              }}>
                🎉 All tickets resolved!
              </span>
            )}
          </div>
          
          <div style={{ display: 'grid', gap: '2rem' }}>
            {activeReports.map(report => (
              <motion.div 
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#f8fafc',
                  padding: '2rem',
                  borderRadius: '20px',
                  border: '2px solid #e2e8f0',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Ticket Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.75rem 0', color: '#1f2937', fontSize: '1.4rem', fontWeight: '700' }}>
                      {report.id}
                    </h3>
                    <p style={{ margin: '0 0 1rem 0', color: '#4b5563', lineHeight: '1.6', fontSize: '1.1rem' }}>
                      {report.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.95rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontWeight: '500' }}>
                        <FaMapMarkerAlt />
                        {report.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontWeight: '500' }}>
                        <FaClock />
                        {new Date(report.timestamp).toLocaleDateString()} at {new Date(report.timestamp).toLocaleTimeString()}
                      </span>
                      {report.photo && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: '600' }}>
                          <FaImage />
                          Photo attached
                        </span>
                      )}
                    </div>
                  </div>
                  <span 
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '25px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      background: report.status === 'Escalated' ? '#fee2e2' : '#fef3c7',
                      color: report.status === 'Escalated' ? '#991b1b' : '#92400e',
                      border: `2px solid ${report.status === 'Escalated' ? '#fecaca' : '#fed7aa'}`
                    }}
                  >
                    {report.status}
                  </span>
                </div>

                {/* Comments Section */}
                <div style={{ 
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  background: 'white',
                  borderRadius: '16px',
                  border: '2px solid #e5e7eb'
                }}>
                  <h4 style={{ 
                    margin: '0 0 1rem 0', 
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1.2rem',
                    fontWeight: '600'
                  }}>
                    <FaComments />
                    Admin Comments
                  </h4>
                  
                  {/* Existing Comments */}
                  {ticketComments[report.id] && ticketComments[report.id].length > 0 ? (
                    <div style={{ marginBottom: '1rem' }}>
                      {ticketComments[report.id].map(comment => (
                        <div key={comment.id} style={{
                          background: '#f8fafc',
                          padding: '1rem',
                          borderRadius: '12px',
                          marginBottom: '0.75rem',
                          border: '1px solid #e2e8f0'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                          }}>
                            <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem' }}>
                              {comment.author}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                              {new Date(comment.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: '0 0 1rem 0', fontStyle: 'italic' }}>
                      No comments yet. Add a comment to document your investigation or resolution process.
                    </p>
                  )}

                  {/* Add Comment */}
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Add a comment about this ticket..."
                      value={newComment[report.id] || ''}
                      onChange={(e) => setNewComment(prev => ({
                        ...prev,
                        [report.id]: e.target.value
                      }))}
                      style={{
                        flex: 1,
                        padding: '1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                    <button
                      onClick={() => handleAddComment(report.id)}
                      disabled={!newComment[report.id] || !newComment[report.id].trim()}
                      style={{
                        padding: '1rem 1.25rem',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        opacity: (!newComment[report.id] || !newComment[report.id].trim()) ? 0.5 : 1,
                        transition: 'all 0.2s',
                        fontWeight: '600'
                      }}
                      onMouseOver={(e) => {
                        if (newComment[report.id] && newComment[report.id].trim()) {
                          e.target.style.background = '#2563eb';
                          e.target.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#3b82f6';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <FaSave />
                    </button>
                  </div>
                </div>

                {/* Action Button */}
                <div style={{ textAlign: 'right' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleResolveReport(report.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem 2rem',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.3s',
                      marginLeft: 'auto'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    <FaCheckCircle />
                    Mark as Resolved
                  </motion.button>
                </div>
              </motion.div>
            ))}
            {activeReports.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                color: '#6b7280', 
                padding: '4rem',
                background: '#f8fafc',
                borderRadius: '20px',
                border: '2px dashed #cbd5e1'
              }}>
                <FaCheckCircle style={{ fontSize: '5rem', color: '#10b981', marginBottom: '1.5rem' }} />
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>All tickets resolved!</h3>
                <p style={{ fontSize: '1.1rem' }}>Excellent work! There are no active reports requiring attention.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage; 