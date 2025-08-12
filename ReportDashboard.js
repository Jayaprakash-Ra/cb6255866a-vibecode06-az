import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { FaEye, FaFilter, FaMapMarkerAlt, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { format } from 'date-fns';
import './ReportDashboard.css';

const ReportDashboard = () => {
  const { state } = useApp();
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState('all');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Reported':
        return <FaClock className="status-icon reported" />;
      case 'Escalated':
        return <FaExclamationTriangle className="status-icon escalated" />;
      case 'Resolved':
        return <FaCheckCircle className="status-icon resolved" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  const filteredReports = state.reports.filter(report => {
    if (filter === 'all') return true;
    return report.status.toLowerCase() === filter;
  });

  const reportCounts = {
    total: state.reports.length,
    reported: state.reports.filter(r => r.status === 'Reported').length,
    escalated: state.reports.filter(r => r.status === 'Escalated').length,
    resolved: state.reports.filter(r => r.status === 'Resolved').length,
  };

  return (
    <div className="report-dashboard">
      <div className="dashboard-header">
        <h2>Reports Dashboard</h2>
        <p>Track and monitor all bin reports</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-number">{reportCounts.total}</div>
          <div className="stat-label">Total Reports</div>
        </div>
        <div className="stat-card reported">
          <div className="stat-number">{reportCounts.reported}</div>
          <div className="stat-label">Reported</div>
        </div>
        <div className="stat-card escalated">
          <div className="stat-number">{reportCounts.escalated}</div>
          <div className="stat-label">Escalated</div>
        </div>
        <div className="stat-card resolved">
          <div className="stat-number">{reportCounts.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Reports</option>
            <option value="reported">Reported</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="reports-grid">
        {filteredReports.length === 0 ? (
          <div className="no-reports">
            <p>No reports found</p>
            <small>Reports will appear here once submitted</small>
          </div>
        ) : (
          filteredReports.map(report => (
            <div key={report.id} className={`report-card ${getStatusClass(report.status)}`}>
              <div className="report-header">
                <div className="report-id">{report.id}</div>
                <div className={`status-badge ${getStatusClass(report.status)}`}>
                  {getStatusIcon(report.status)}
                  {report.status}
                </div>
              </div>
              
              <div className="report-content">
                <div className="report-type">
                  <span className="type-icon">
                    {report.type === 'full' ? '🗑️' : '⚠️'}
                  </span>
                  <span className="type-text">
                    {report.type === 'full' ? 'Bin Full' : 'Bin Damaged'}
                  </span>
                </div>
                
                <div className="report-description">
                  {report.description}
                </div>
                
                <div className="report-location">
                  <FaMapMarkerAlt className="location-icon" />
                  <span>{report.location}</span>
                </div>
                
                <div className="report-timestamp">
                  <FaClock className="time-icon" />
                  <span>{format(new Date(report.timestamp), 'MMM dd, yyyy HH:mm')}</span>
                </div>
              </div>
              
              <div className="report-actions">
                <button 
                  onClick={() => setSelectedReport(report)}
                  className="view-button"
                >
                  <FaEye />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedReport && (
        <ReportModal 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};

const ReportModal = ({ report, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Report Details</h3>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        
        <div className="modal-body">
          <div className="detail-row">
            <label>Report ID:</label>
            <span>{report.id}</span>
          </div>
          
          <div className="detail-row">
            <label>Type:</label>
            <span>
              {report.type === 'full' ? '🗑️ Bin Full' : '⚠️ Bin Damaged'}
            </span>
          </div>
          
          <div className="detail-row">
            <label>Status:</label>
            <span className={`status-badge ${report.status.toLowerCase()}`}>
              {report.status}
            </span>
          </div>
          
          <div className="detail-row">
            <label>Description:</label>
            <p>{report.description}</p>
          </div>
          
          <div className="detail-row">
            <label>Location:</label>
            <span>{report.location}</span>
          </div>
          
          <div className="detail-row">
            <label>Reported:</label>
            <span>{format(new Date(report.timestamp), 'MMMM dd, yyyy at HH:mm')}</span>
          </div>
          
          {report.photo && (
            <div className="detail-row">
              <label>Photo:</label>
              <div className="photo-container">
                <img src={report.photo} alt="Report" />
              </div>
            </div>
          )}
          
          {report.coordinates && (
            <div className="detail-row">
              <label>Coordinates:</label>
              <span>{report.coordinates.lat.toFixed(6)}, {report.coordinates.lng.toFixed(6)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard; 