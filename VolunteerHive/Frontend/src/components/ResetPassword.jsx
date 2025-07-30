import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PasswordReset.css';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, code } = location.state || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!email || !code) {
    return (
      <div className="password-reset-container">
        <div className="reset-card">
          <div className="reset-header">
            <h1 className="reset-title">Error</h1>
            <p className="reset-subtitle">Missing information. Please restart the password reset process from the login page.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      toast.success('Password reset successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-reset-container">
      <div className="reset-card">
        <div className="reset-header">
          <h1 className="reset-title">Reset Password</h1>
          <p className="reset-subtitle">Enter your new password below.</p>
        </div>
        <form className="reset-form" onSubmit={handleSubmit}>
          <div className="reset-form-group">
            <label htmlFor="newPassword" className="reset-form-label">New Password</label>
            <div className="reset-input-wrapper">
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className={`reset-form-input${error ? ' error' : ''}`}
                disabled={loading}
                autoFocus
              />
            </div>
          </div>
          <div className="reset-form-group">
            <label htmlFor="confirmPassword" className="reset-form-label">Confirm Password</label>
            <div className="reset-input-wrapper">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className={`reset-form-input${error ? ' error' : ''}`}
                disabled={loading}
              />
            </div>
          </div>
          {error && <div className="reset-error-message">{error}</div>}
          <button type="submit" className="reset-submit-button" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 