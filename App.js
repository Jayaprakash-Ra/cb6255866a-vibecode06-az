import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import ReportPage from './pages/ReportPage';
import SchedulePage from './pages/SchedulePage';
import EducationPage from './pages/EducationPage';
import RewardsPage from './pages/RewardsPage';
import AdminPage from './pages/AdminPage';
import GPSDemo from './components/Demo/GPSDemo';
import AdminDemo from './components/Demo/AdminDemo';
import './App.css';
import { ToastProvider } from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppProvider>
          <Router>
            <div className="App">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/report" element={<ReportPage />} />
                  <Route path="/schedule" element={<SchedulePage />} />
                  <Route path="/education" element={<EducationPage />} />
                  <Route path="/rewards" element={<RewardsPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/gps-demo" element={<GPSDemo />} />
                  <Route path="/admin-demo" element={<AdminDemo />} />
                </Routes>
              </main>
            </div>
          </Router>
        </AppProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
  