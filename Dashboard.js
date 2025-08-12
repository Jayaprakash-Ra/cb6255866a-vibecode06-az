import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import ReportDashboard from '../components/Reporting/ReportDashboard';
import { FaChartLine, FaExclamationTriangle, FaCalendarAlt, FaGraduationCap, FaGift } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { state } = useApp();

  const dashboardStats = {
    totalReports: state.reports.length,
    escalatedReports: state.reports.filter(r => r.status === 'Escalated').length,
    userPoints: state.user.points,
    totalRedemptions: state.redemptions.length
  };

  const quickActions = [
    {
      title: 'Report Issue',
      description: 'Report a full or damaged bin',
      icon: <FaExclamationTriangle />,
      link: '/report',
      color: '#ef4444'
    },
    {
      title: 'View Schedule',
      description: 'Check collection schedules',
      icon: <FaCalendarAlt />,
      link: '/schedule',
      color: '#3b82f6'
    },
    {
      title: 'Learn More',
      description: 'Educational resources',
      icon: <FaGraduationCap />,
      link: '/education',
      color: '#10b981'
    },
    {
      title: 'Earn Rewards',
      description: 'View and redeem points',
      icon: <FaGift />,
      link: '/rewards',
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-header"
        >
          <h1>
            <FaChartLine className="header-icon" />
            Dashboard
          </h1>
          <p>Welcome back, {state.user.name}! Here's your waste management overview.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stats-overview"
        >
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon reports">📊</div>
              <div className="stat-content">
                <h3>{dashboardStats.totalReports}</h3>
                <p>Total Reports</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon escalated">⚠️</div>
              <div className="stat-content">
                <h3>{dashboardStats.escalatedReports}</h3>
                <p>Escalated Issues</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon points">🏆</div>
              <div className="stat-content">
                <h3>{dashboardStats.userPoints}</h3>
                <p>Reward Points</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon redemptions">🎁</div>
              <div className="stat-content">
                <h3>{dashboardStats.totalRedemptions}</h3>
                <p>Redemptions</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="quick-actions"
        >
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={action.link} className="action-card">
                  <div 
                    className="action-icon"
                    style={{ backgroundColor: action.color }}
                  >
                    {action.icon}
                  </div>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="reports-section"
        >
          <div className="reports-section-header">
            <h2>Reports Dashboard</h2>
          </div>
          <ReportDashboard />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 