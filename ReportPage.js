import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReportForm from '../components/Reporting/ReportForm';
import { FaCheckCircle } from 'react-icons/fa';

const ReportPage = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  const handleReportSubmit = (report) => {
    setSubmittedReport(report);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="report-page">
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="success-notification"
          style={{
            position: 'fixed',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#10b981',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '12px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FaCheckCircle />
          <span>Report submitted successfully! ID: {submittedReport?.id}</span>
        </motion.div>
      )}
      <ReportForm onSubmit={handleReportSubmit} />
    </div>
  );
};

export default ReportPage; 