import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = ({ allowedRoles = [], children }) => {
  const navigate = useNavigate();
  const user_role = localStorage.getItem('auth_role');

  if (allowedRoles.length > 0 && allowedRoles.includes(user_role)) {
    return children || null;
  }

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">🚫</div>
        <h1>Unauthorized Access</h1>
        <p>You do not have permission to view this page.</p>
        <button className="unauthorized-btn" onClick={() => navigate('/')}>Go back home</button>
      </div>
    </div>
  );
};

export default Unauthorized; 