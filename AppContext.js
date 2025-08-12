import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { sampleReports } from '../data/sampleReports';

const AppContext = createContext();

// Check for saved admin session
const getInitialUser = () => {
  const savedUser = JSON.parse(localStorage.getItem('user')) || { role: 'user', points: 0, name: 'User' };
  const adminSession = JSON.parse(localStorage.getItem('adminSession'));
  
  // If admin session exists and is recent (within 24 hours), restore admin user
  if (adminSession && adminSession.user && adminSession.timestamp) {
    const sessionTime = new Date(adminSession.timestamp);
    const now = new Date();
    const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);
    
    if (hoursDiff < 24) {
      return adminSession.user;
    } else {
      // Session expired, clear it
      localStorage.removeItem('adminSession');
    }
  }
  
  return savedUser;
};

// Initial state
const initialState = {
  user: getInitialUser(),
  reports: JSON.parse(localStorage.getItem('reports')) || sampleReports.slice(0, 3), // Add some sample reports
  schedules: JSON.parse(localStorage.getItem('schedules')) || [],
  redemptions: JSON.parse(localStorage.getItem('redemptions')) || [],
  currentLocation: null,
};

// Action types
export const actionTypes = {
  SET_USER: 'SET_USER',
  ADD_REPORT: 'ADD_REPORT',
  UPDATE_REPORT: 'UPDATE_REPORT',
  ADD_SCHEDULE: 'ADD_SCHEDULE',
  UPDATE_SCHEDULE: 'UPDATE_SCHEDULE',
  DELETE_SCHEDULE: 'DELETE_SCHEDULE',
  ADD_POINTS: 'ADD_POINTS',
  REDEEM_POINTS: 'REDEEM_POINTS',
  SET_LOCATION: 'SET_LOCATION',
};

// Reducer function
const appReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case actionTypes.SET_USER:
      newState = { ...state, user: action.payload };
      localStorage.setItem('user', JSON.stringify(newState.user));
      return newState;
      
    case actionTypes.ADD_REPORT:
      newState = { 
        ...state, 
        reports: [...state.reports, action.payload] 
      };
      localStorage.setItem('reports', JSON.stringify(newState.reports));
      return newState;
      
    case actionTypes.UPDATE_REPORT:
      newState = {
        ...state,
        reports: state.reports.map(report =>
          report.id === action.payload.id ? { ...report, ...action.payload } : report
        )
      };
      localStorage.setItem('reports', JSON.stringify(newState.reports));
      return newState;
      
    case actionTypes.ADD_SCHEDULE:
      newState = {
        ...state,
        schedules: [...state.schedules, action.payload]
      };
      localStorage.setItem('schedules', JSON.stringify(newState.schedules));
      return newState;
      
    case actionTypes.UPDATE_SCHEDULE:
      newState = {
        ...state,
        schedules: state.schedules.map(schedule =>
          schedule.id === action.payload.id ? { ...schedule, ...action.payload } : schedule
        )
      };
      localStorage.setItem('schedules', JSON.stringify(newState.schedules));
      return newState;
      
    case actionTypes.DELETE_SCHEDULE:
      newState = {
        ...state,
        schedules: state.schedules.filter(schedule => schedule.id !== action.payload)
      };
      localStorage.setItem('schedules', JSON.stringify(newState.schedules));
      return newState;
      
    case actionTypes.ADD_POINTS:
      newState = {
        ...state,
        user: { ...state.user, points: state.user.points + action.payload }
      };
      localStorage.setItem('user', JSON.stringify(newState.user));
      return newState;
      
    case actionTypes.REDEEM_POINTS:
      const newRedemption = action.payload;
      newState = {
        ...state,
        user: { ...state.user, points: state.user.points - newRedemption.points },
        redemptions: [...state.redemptions, newRedemption]
      };
      localStorage.setItem('user', JSON.stringify(newState.user));
      localStorage.setItem('redemptions', JSON.stringify(newState.redemptions));
      return newState;
      
    case actionTypes.SET_LOCATION:
      return { ...state, currentLocation: action.payload };
      
    default:
      return state;
  }
};

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auto-escalate reports after 3 hours (simulated with 10 seconds for demo)
  useEffect(() => {
    const checkEscalations = () => {
      const now = new Date();
      state.reports.forEach(report => {
        if (report.status === 'Reported') {
          const reportTime = new Date(report.timestamp);
          const timeDiff = now - reportTime;
          // 3 hours = 10800000 milliseconds, using 10000 (10 seconds) for demo
          if (timeDiff > 10000) {
            dispatch({
              type: actionTypes.UPDATE_REPORT,
              payload: { ...report, status: 'Escalated' }
            });
          }
        }
      });
    };

    const interval = setInterval(checkEscalations, 5000);
    return () => clearInterval(interval);
  }, [state.reports]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext; 