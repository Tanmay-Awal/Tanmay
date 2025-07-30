import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './FloatingDashboardFAB.css';

const FloatingDashboardFAB = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  let dashboardRoute = '/';
  const role = user?.role?.toLowerCase();
  if (role === 'admin') {
    dashboardRoute = '/ngo-dashboard';
  } else if (role === 'user') {
    dashboardRoute = '/volunteer-dashboard';
  }

  return (
    <button
      className="floating-dashboard-fab"
      title="Go to Dashboard"
      onClick={() => navigate(dashboardRoute)}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    </button>
  );
};

export default FloatingDashboardFAB; 