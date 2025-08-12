import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp, actionTypes } from '../../contexts/AppContext';
import { FaRecycle, FaCrown, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import AdminLogin from '../Auth/AdminLogin';
import './Header.css';

const Header = () => {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const toggleRole = () => {
    const newRole = state.user.role === 'admin' ? 'user' : 'admin';
    dispatch({
      type: actionTypes.SET_USER,
      payload: { ...state.user, role: newRole }
    });
  };

  const handleAdminLogin = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLogout = () => {
    // Reset to regular user
    dispatch({
      type: actionTypes.SET_USER,
      payload: { 
        role: 'user', 
        points: 0, 
        name: 'User',
        id: 'user-001'
      }
    });
    // Clear admin session
    localStorage.removeItem('adminSession');
  };

  const handleLoginSuccess = (adminUser) => {
    setShowAdminLogin(false);
  };

  const handleLoginCancel = () => {
    setShowAdminLogin(false);
  };

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/report', label: 'Report Issue' },
    { path: '/schedule', label: 'Collection Schedule' },
    { path: '/education', label: 'Learn' },
    { path: '/rewards', label: 'Rewards' },
    { path: '/admin', label: 'Manage Tickets' },
  ];

  return (
    <header className="header">
      <div className="container">
        <div className="header-brand">
          <Link to="/" className="brand-link">
            <FaRecycle className="brand-icon" />
            <span className="brand-text">SMART Bin Tracker</span>
          </Link>
        </div>
        
        <nav className="nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              title={item.path === '/admin' ? 'Access admin panel to manage tickets' : ''}
            >
              {item.path === '/admin' && <FaCrown style={{ marginRight: '0.5rem' }} />}
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="header-actions">
          <div className="user-info">
            <span className="points">Rewards *{state.user.points}</span>
            <span className="user-name">👤 {state.user.name}</span>
            
            {/* Admin Login/Logout Controls */}
            {state.user.role === 'admin' ? (
              <div className="admin-controls">
                <span className="admin-badge">
                  <FaCrown style={{ marginRight: '0.25rem' }} />
                  Admin Mode
                </span>
                <button 
                  onClick={handleAdminLogout}
                  className="admin-logout-btn"
                  title="Logout from admin mode"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={handleAdminLogin}
                className="admin-login-btn"
                title="Login as admin to manage tickets"
              >
                <FaSignInAlt />
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin 
          onLoginSuccess={handleLoginSuccess}
          onCancel={handleLoginCancel}
        />
      )}
    </header>
  );
};

export default Header; 