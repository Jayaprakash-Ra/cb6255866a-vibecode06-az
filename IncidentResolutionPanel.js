import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaMapMarkerAlt, 
  FaCamera,
  FaClock,
  FaCoins,
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaSpinner,
  FaAward
} from 'react-icons/fa';
import IncidentResolutionService from '../../services/incidentResolutionService';
import { useToast } from '../common/Toast';
import { format } from 'date-fns';

const IncidentResolutionPanel = ({ incidents, onIncidentResolved }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [resolutionForm, setResolutionForm] = useState({
    notes: '',
    type: 'completed',
    verificationPhoto: null
  });
  const [isResolving, setIsResolving] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [pointsPreview, setPointsPreview] = useState(null);
  const toast = useToast();

  // Filter to show only unresolved incidents
  const unresolvedIncidents = incidents.filter(
    incident => incident.status !== 'Resolved'
  );

  // Calculate points preview when incident is selected
  useEffect(() => {
    if (selectedIncident) {
      calculatePointsPreview(selectedIncident);
    }
  }, [selectedIncident]);

  const calculatePointsPreview = (incident) => {
    const resolutionRewards = {
      'full': 15,
      'damaged': 20,
      'hazardous': 25,
      'emergency': 30
    };

    let basePoints = resolutionRewards[incident.type] || 15;
    let multiplier = 1.0;
    const bonuses = [];

    // Urgent bonus
    if (incident.priority === 'urgent' || incident.status === 'Escalated') {
      multiplier *= 1.5;
      bonuses.push('Urgent incident (+50%)');
    }

    // Photo verification bonus
    if (incident.photo) {
      multiplier *= 1.25;
      bonuses.push('Photo verification (+25%)');
    }

    // GPS location bonus
    if (incident.coordinates) {
      multiplier *= 1.2;
      bonuses.push('GPS location (+20%)');
    }

    // Quick resolution bonus
    const reportTime = new Date(incident.timestamp);
    const now = new Date();
    const hoursToResolve = (now - reportTime) / (1000 * 60 * 60);
    
    if (hoursToResolve <= 24) {
      multiplier *= 1.1;
      bonuses.push('Quick resolution (+10%)');
    }

    const finalPoints = Math.round(basePoints * multiplier);

    setPointsPreview({
      basePoints,
      multiplier,
      finalPoints,
      bonuses
    });
  };

  const handleResolveIncident = async (incident) => {
    setSelectedIncident(incident);
    setShowResolutionModal(true);
  };

  const submitResolution = async () => {
    if (!selectedIncident) return;

    setIsResolving(true);
    try {
      const result = await IncidentResolutionService.resolveIncident(
        selectedIncident.id,
        resolutionForm
      );

      toast.success(
        `Incident resolved! User awarded ${result.pointsAwarded} points.`,
        7000
      );

      // Reset form
      setResolutionForm({
        notes: '',
        type: 'completed',
        verificationPhoto: null
      });
      
      setShowResolutionModal(false);
      setSelectedIncident(null);

      // Notify parent component
      if (onIncidentResolved) {
        onIncidentResolved(result);
      }

    } catch (error) {
      toast.error(`Failed to resolve incident: ${error.message}`);
    } finally {
      setIsResolving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Reported': return '#3b82f6';
      case 'Escalated': return '#ef4444';
      case 'In Progress': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (type) => {
    switch (type) {
      case 'emergency': return '#dc2626';
      case 'hazardous': return '#ea580c';
      case 'damaged': return '#d97706';
      default: return '#059669';
    }
  };

  return (
    <div className="incident-resolution-panel">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaExclamationTriangle style={{ color: '#f59e0b' }} />
          Incident Resolution Panel
        </h2>
        <p style={{ color: '#6b7280' }}>
          Resolve incidents and automatically credit points to users
        </p>
      </div>

      {unresolvedIncidents.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '2px dashed #d1d5db'
        }}>
          <FaCheckCircle style={{ fontSize: '3rem', color: '#10b981', marginBottom: '1rem' }} />
          <h3>All incidents resolved!</h3>
          <p style={{ color: '#6b7280' }}>Great work! No pending incidents at the moment.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
        }}>
          {unresolvedIncidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onResolve={() => handleResolveIncident(incident)}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      )}

      {/* Resolution Modal */}
      <AnimatePresence>
        {showResolutionModal && selectedIncident && (
          <ResolutionModal
            incident={selectedIncident}
            pointsPreview={pointsPreview}
            resolutionForm={resolutionForm}
            setResolutionForm={setResolutionForm}
            isResolving={isResolving}
            onSubmit={submitResolution}
            onCancel={() => {
              setShowResolutionModal(false);
              setSelectedIncident(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Individual Incident Card Component
const IncidentCard = ({ incident, onResolve, getStatusColor, getPriorityColor }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div>
          <h3 style={{ 
            margin: '0 0 0.5rem 0',
            fontSize: '1.1rem',
            color: '#1f2937'
          }}>
            {incident.id}
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600',
              background: getStatusColor(incident.status) + '20',
              color: getStatusColor(incident.status)
            }}>
              {incident.status}
            </span>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600',
              background: getPriorityColor(incident.type) + '20',
              color: getPriorityColor(incident.type)
            }}>
              {incident.type}
            </span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onResolve}
          style={{
            padding: '0.5rem 1rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}
        >
          Resolve
        </motion.button>
      </div>

      {/* Description */}
      <p style={{
        margin: '0 0 1rem 0',
        color: '#4b5563',
        lineHeight: '1.5'
      }}>
        {incident.description}
      </p>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaMapMarkerAlt style={{ color: '#6b7280' }} />
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {incident.location}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaClock style={{ color: '#6b7280' }} />
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Reported {format(new Date(incident.timestamp), 'MMM dd, yyyy - HH:mm')}
          </span>
        </div>

        {incident.photo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaCamera style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.875rem', color: '#10b981' }}>
              Photo attached
            </span>
          </div>
        )}

        {incident.reportedBy && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaUser style={{ color: '#6b7280' }} />
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Reported by User #{incident.reportedBy}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Resolution Modal Component
const ResolutionModal = ({ 
  incident, 
  pointsPreview, 
  resolutionForm, 
  setResolutionForm, 
  isResolving, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem'
      }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <h2 style={{ marginBottom: '1.5rem' }}>Resolve Incident</h2>

        {/* Incident Summary */}
        <div style={{
          background: '#f9fafb',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>{incident.id}</h3>
          <p style={{ margin: '0', color: '#6b7280' }}>{incident.description}</p>
        </div>

        {/* Points Preview */}
        {pointsPreview && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              margin: '0 0 0.5rem 0',
              color: '#059669'
            }}>
              <FaAward />
              Points to be Awarded: {pointsPreview.finalPoints}
            </h4>
            <div style={{ fontSize: '0.875rem', color: '#065f46' }}>
              <p style={{ margin: '0 0 0.25rem 0' }}>
                Base points: {pointsPreview.basePoints}
              </p>
              {pointsPreview.bonuses.length > 0 && (
                <div>
                  <p style={{ margin: '0.5rem 0 0.25rem 0', fontWeight: '600' }}>Bonuses:</p>
                  {pointsPreview.bonuses.map((bonus, index) => (
                    <p key={index} style={{ margin: '0 0 0 1rem' }}>• {bonus}</p>
                  ))}
                </div>
              )}
              <p style={{ margin: '0.5rem 0 0 0', fontWeight: '600' }}>
                Total multiplier: {pointsPreview.multiplier.toFixed(2)}x
              </p>
            </div>
          </div>
        )}

        {/* Resolution Form */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Resolution Type
            </label>
            <select
              value={resolutionForm.type}
              onChange={(e) => setResolutionForm(prev => ({
                ...prev,
                type: e.target.value
              }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="completed">Completed</option>
              <option value="duplicate">Duplicate Report</option>
              <option value="false-alarm">False Alarm</option>
              <option value="partially-resolved">Partially Resolved</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Resolution Notes
            </label>
            <textarea
              value={resolutionForm.notes}
              onChange={(e) => setResolutionForm(prev => ({
                ...prev,
                notes: e.target.value
              }))}
              placeholder="Enter details about how the incident was resolved..."
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'flex-end' 
        }}>
          <button
            onClick={onCancel}
            disabled={isResolving}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: 'white',
              color: '#374151',
              cursor: isResolving ? 'not-allowed' : 'pointer',
              opacity: isResolving ? 0.5 : 1
            }}
          >
            Cancel
          </button>
          
          <motion.button
            whileHover={{ scale: isResolving ? 1 : 1.05 }}
            whileTap={{ scale: isResolving ? 1 : 0.95 }}
            onClick={onSubmit}
            disabled={isResolving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isResolving ? 'not-allowed' : 'pointer',
              opacity: isResolving ? 0.7 : 1
            }}
          >
            {isResolving ? (
              <>
                <FaSpinner className="spinning" />
                Resolving...
              </>
            ) : (
              <>
                <FaCheckCircle />
                Resolve & Credit Points
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IncidentResolutionPanel; 