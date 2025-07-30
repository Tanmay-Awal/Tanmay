
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  signupSelectors,
  signupActions,
  submitRegistration,
} from '../store/signupSlice';

import { useNavigate } from 'react-router-dom';
import { googleAuthService } from '../services/googleAuthService';
import GoogleAuthButton from './GoogleAuthButton';

import './Signup.css';
import { Eye, EyeOff, Mail, Lock, Users, Building } from 'lucide-react';
import { toast } from 'react-toastify';

const slideshowImages = [
  'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dm9sdW50ZWVyfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1618477460930-d8bffff64172?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHZvbHVudGVlcmluZ3xlbnwwfHwwfHx8MA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1679541668124-a02fb1fc167b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D',
];

const Signup = () => {
  const dispatch = useDispatch();
  const formData = useSelector(signupSelectors.getFormData);
  const errors = useSelector(signupSelectors.getSignupErrors);
  const showPassword = useSelector(signupSelectors.getShowPassword);
  const isLoading = useSelector(signupSelectors.getIsLoading);

  const navigate = useNavigate();

  const [slideIndex, setSlideIndex] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (name, value) => {
    dispatch(signupActions.updateField({ field: name, value })); 
    dispatch(signupActions.clearError(name)); 
  };

  const handleRoleSelect = (role) => {
    dispatch(signupActions.updateField({ field: 'role', value: role })); 
    dispatch(signupActions.clearError('role')); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    if (!formData.email) {
      dispatch(signupActions.updateField({ field: 'email', value: formData.email }));
      dispatch(signupActions.setError({ field: 'email', message: 'Email is required' }));
      hasError = true;
    }
    if (!formData.password) {
      dispatch(signupActions.updateField({ field: 'password', value: formData.password }));
      dispatch(signupActions.setError({ field: 'password', message: 'Password is required' }));
      hasError = true;
    }
    if (!formData.role) {
      dispatch(signupActions.updateField({ field: 'role', value: formData.role }));
      dispatch(signupActions.setError({ field: 'role', message: 'Role is required' }));
      hasError = true;
    }
    if (hasError) {
      return;
    }
    dispatch(submitRegistration({ formData, navigate }));
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleGoogleSignup = async (accessToken) => {
    try {
      setGoogleLoading(true);
      console.log('Starting Google signup with token:', accessToken);
      
      const response = await fetch('http://localhost:5000/api/auth/google/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: accessToken,
          role: formData.role   
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        
        if (response.status === 400) {
          if (errorData.message && errorData.message.toLowerCase().includes('already exists')) {
            throw new Error('An account with this email already exists. Please use a different email or try logging in.');
          }
          throw new Error(errorData.message || 'Invalid request. Please check your information.');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(errorData.message || 'Google signup failed. Please try again.');
        }
      }

      const data = await response.json();
      console.log('Google signup success:', data);
      

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user_email', data.data.email);
      localStorage.setItem('user_id', data.data.id);
      localStorage.setItem('userId', data.data.id); 
      localStorage.setItem('auth_role', data.data.role);
      localStorage.setItem('is_google_user', 'true'); 
      

      if (data.data.role === 'admin') {
        navigate('/ngo-setup');
      } else {
        navigate('/volunteer-dashboard');
      }
      
      toast.success('Google signup successful!');
      setGoogleLoading(false);
      
    } catch (error) {
      setGoogleLoading(false);
      console.error('Google signup error:', error);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Google signup failed. Please try again.');
      }
    }
  };

  const handleGoogleError = (error) => {
    console.log('handleGoogleError called with:', error); 
    if (error.message === 'Please select your role (Volunteer or NGO) before continuing with Google') {
      console.log('Showing role selection toast'); 
      toast.error(error.message);
      return;
    }
    console.error('Google auth error:', error);
    if (error.message) {
      toast.error(error.message);
    }
  };

  return (
    <div className="signup-split-container">
      <div className="signup-left">
        <div className="signup-background">
          <div className="gradient-overlay"></div>
        </div>
        <div className="signup-content">
          <div className="signup-card">
            <div className="signup-header">
              <h1 className="signup-title">Join VolunteerHive</h1>
            </div>

            <div className="signup-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange('password', e.target.value)
                    }
                    placeholder="Create a strong password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      dispatch(signupActions.togglePasswordVisibility())
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">I am a...</label>
                <div className="role-selection">
                  <div
                    className={`role-card ${
                      formData.role === 'user' ? 'selected' : ''
                    }`}
                    onClick={() => handleRoleSelect('user')}
                  >
                    <div className="role-icon">
                      <Users size={24} />
                    </div>
                    <div className="role-info">
                      <h3>Volunteer</h3>
                    </div>
                  </div>

                  <div
                    className={`role-card ${
                      formData.role === 'admin' ? 'selected' : ''
                    }`}
                    onClick={() => handleRoleSelect('admin')}
                  >
                    <div className="role-icon">
                      <Building size={24} />
                    </div>
                    <div className="role-info">
                      <h3>NGO / Organization</h3>
                    </div>
                  </div>
                </div>
                {errors.role && (
                  <span className="error-message">{errors.role}</span>
                )}
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
              
              {isLoading && (
                <div className="loading-info">
                  <p>Setting up your account...</p>
                  <p className="loading-detail">This should take just a few seconds</p>
                </div>
              )}

              <div className="auth-divider">
                <span>or</span>
              </div>

              <GoogleAuthButton
                onSuccess={handleGoogleSignup}
                onError={handleGoogleError}
                mode="signup"
                role={formData.role}
                disabled={isLoading || googleLoading}
                loading={googleLoading}
              />

              {errors.general && (
                <div className="general-error">{errors.general}</div>
              )}
            </div>

            <div className="signup-footer">
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="login-link"
                  onClick={handleLoginRedirect}
                  disabled={isLoading}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
<div className="signup-right">
  <div className="slideshow-container">
    {slideshowImages.map((img, idx) => (
      <img
        key={img}
        src={img}
        className={`slideshow-image${slideIndex === idx ? ' active' : ''}`}
        style={{ opacity: slideIndex === idx ? 1 : 0 }}
      />
    ))}
    <div className="slideshow-dots">
      {slideshowImages.map((_, idx) => (
        <span
          key={idx}
          className={`slideshow-dot${slideIndex === idx ? ' active' : ''}`}
          onClick={() => setSlideIndex(idx)}
        />
      ))}
    </div>
  </div>
</div>
    </div>
  );
};

export default Signup;
