import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authSelectors, authActions, submitLogin } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { googleAuthService } from "../services/googleAuthService";
import GoogleAuthButton from "./GoogleAuthButton";

import { Eye, EyeOff, Mail, Lock, Users, Building, ArrowRight } from "lucide-react";
import "./Login.css";
import { toast } from "react-toastify";

const slideshowImages = [
  'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dm9sdW50ZWVyfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1618477460930-d8bffff64172?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHZvbHVudGVlcmluZ3xlbnwwfHwwfHx8MA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1679541668124-a02fb1fc167b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D',
];

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formData = useSelector(authSelectors.getLoginForm);
  const errors = useSelector(authSelectors.getLoginErrors);
  const showPassword = useSelector(authSelectors.getShowPassword);
  const isLoading = useSelector(authSelectors.getIsLoading);

  const [slideIndex, setSlideIndex] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (name, value) => {
    dispatch(authActions.updateLoginField({ field: name, value }));
    dispatch(authActions.clearLoginError(name));
  };

  const handleRoleSelect = (role) => {
    dispatch(authActions.updateLoginField({ field: "role", value: role }));
    dispatch(authActions.clearLoginError("role"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!formData.email) {
      dispatch(authActions.updateLoginField({ field: 'email', value: formData.email }));
      dispatch(authActions.setLoginError({ field: 'email', message: 'Email is required' }));
      hasError = true;
    }
    if (!formData.password) {
      dispatch(authActions.updateLoginField({ field: 'password', value: formData.password }));
      dispatch(authActions.setLoginError({ field: 'password', message: 'Password is required' }));
      hasError = true;
    }
    if (!formData.role) {
      dispatch(authActions.updateLoginField({ field: 'role', value: formData.role }));
      dispatch(authActions.setLoginError({ field: 'role', message: 'Role is required' }));
      hasError = true;
    }
    if (hasError) {
      return;
    }
    dispatch(submitLogin({ formData, navigate }))
      .then((action) => {
        if (action && action.error && action.error.message) {
          if (action.payload && action.payload === 'Incorrect password') {
            dispatch(authActions.setLoginError({ field: 'password', message: 'Incorrect password' }));
          } else if (action.payload && typeof action.payload === 'string') {
            dispatch(authActions.setLoginError({ field: 'general', message: action.payload }));
          }
        }
      });
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error('Please enter your email first.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/check-email-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Unable to process request.');
        return;
      }

      localStorage.setItem('user_email', formData.email);
      localStorage.setItem('auth_role', formData.role);
      navigate('/forgot-password');
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
  };

  const handleGoogleLogin = async (accessToken) => {
    try {
      console.log('Starting Google login with token:', accessToken);
      
      const response = await fetch('http://localhost:5000/api/auth/google/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: accessToken,  
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        

        if (response.status === 404) {
          toast.error('Account not found. Please sign up first.');

          setTimeout(() => {
            navigate('/signup');
          }, 2000);
          return;
        }
        
        throw new Error(errorData.message || 'Google login failed');
      }

      const data = await response.json();
      console.log('Google login success:', data);
      

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user_id', data.data.id);
      localStorage.setItem('user_email', data.data.email); 
      localStorage.setItem('auth_role', data.data.role); 
      localStorage.setItem('is_google_user', 'true'); 
      
      console.log('🔍 Google Login - Setting localStorage user_email:', data.data.email);
      

      dispatch(authActions.updateUserInfo({
        email: data.data.email,
        role: data.data.role
      }));
      

      if (data.data.role === 'admin') {
        if (data.data.needsNGOSetup) {
          navigate('/ngo-setup');
        } else {
          navigate('/ngo-dashboard');
        }
      } else {
        navigate('/volunteer-dashboard');
      }
      
      toast.success('Google login successful!');
      
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Google login failed. Please try again.');
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google auth error:', error);
    if (error.message) {
      toast.error(error.message);
    } else {
      toast.error('Google authentication failed. Please try again.');
    }
  };

  return (
    <div className="login-split-container">
      <div className="login-left">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
          </div>
          <div className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className={`form-input ${errors.email ? "error" : ""}`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter your password"
                  className={`form-input ${errors.password ? "error" : ""}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => dispatch(authActions.togglePasswordVisibility())}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label">I am a...</label>
              <div className="role-selection">
                <div
                  className={`role-card ${formData.role === "user" ? "selected" : ""}`}
                  onClick={() => handleRoleSelect("user")}
                >
                  <div className="role-icon">
                    <Users size={22} />
                  </div>
                  <div className="role-info">
                    <h3>Volunteer</h3>
                  </div>
                </div>
                <div
                  className={`role-card ${formData.role === "admin" ? "selected" : ""}`}
                  onClick={() => handleRoleSelect("admin")}
                >
                  <div className="role-icon">
                    <Building size={22} />
                  </div>
                  <div className="role-info">
                    <h3>NGO / Organization</h3>
                  </div>
                </div>
              </div>
              {errors.role && <span className="error-message">{errors.role}</span>}
            </div>

            <div className="forgot-password-wrapper">
              <button
                type="button"
                className="forgot-password-link"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                Forgot your password?
              </button>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <span className="loading-content">
                  <div className="spinner"></div>
                  Signing in...
                </span>
              ) : (
                <span className="button-content">
                  Sign In <ArrowRight size={20} className="button-icon" />
                </span>
              )}
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <GoogleAuthButton
              onSuccess={handleGoogleLogin}
              onError={handleGoogleError}
              mode="login"
              disabled={isLoading}
            />


            {errors.general && <div className="general-error">{errors.general}</div>}
          </div>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="signup-link"
                onClick={handleSignupRedirect}
                disabled={isLoading}
              >
                Create one here
              </button>
            </p>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="slideshow-container">
          {slideshowImages.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt="NGO visual"
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

export default Login;
