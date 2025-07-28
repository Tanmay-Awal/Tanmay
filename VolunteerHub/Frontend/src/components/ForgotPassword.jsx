import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PasswordReset.css';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [resent, setResent] = useState(false);
  const otpSentRef = useRef(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('user_email');
    const storedRole = localStorage.getItem('auth_role');
    setEmail(storedEmail || '');
    setRole(storedRole || '');
    if (storedEmail) {
      const otpSentKey = `otp_sent_${storedEmail}`;
      if (!sessionStorage.getItem(otpSentKey)) {
        sendOtp(storedEmail);
        sessionStorage.setItem(otpSentKey, 'true');
      }
    } else {
      setError('No email found. Please go back to login.');
    }
  }, []);

  const sendOtp = async (emailToSend) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSend }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      toast.success('OTP sent to your registered email!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResent(true);
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend OTP');
      toast.success('OTP resent!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setResent(false), 3000);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid code');
      toast.success('OTP verified!');
      navigate('/reset-password', { state: { email, code: otp } });
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
          <h1 className="reset-title">Forgot Password</h1>
          <p className="reset-subtitle">A 4-digit code has been sent to your registered email.</p>
        </div>
        <form className="reset-form" onSubmit={handleVerify}>
          <div className="reset-form-group">
            <label htmlFor="otp" className="reset-form-label">Enter OTP</label>
            <div className="reset-input-wrapper">
              <input
                type="text"
                id="otp"
                maxLength={4}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="4-digit code"
                className={`reset-form-input${error ? ' error' : ''}`}
                disabled={loading}
                autoFocus
              />
            </div>
          </div>
          {error && <div className="reset-error-message">{error}</div>}
          <button type="submit" className="reset-submit-button" disabled={loading || otp.length !== 4}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
          <div className="reset-forgot-password-wrapper">
            <button
              type="button"
              className="reset-forgot-password-link"
              onClick={handleResend}
              disabled={loading || resent}
            >
              {resent ? 'OTP Sent!' : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 