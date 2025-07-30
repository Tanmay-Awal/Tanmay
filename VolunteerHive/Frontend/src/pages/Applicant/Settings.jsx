import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';

import {
  Settings as SettingsIcon,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trash2,
  AlertTriangle,
  Shield,
  Lock,
  Bell,
  LogOut,
  
} from 'lucide-react';

import { fetchProfile, profileSelectors } from '../../store/Applicant/profileSlice'; // ✅ ADD THIS
import {
  submitEmailUpdate,
  submitPasswordUpdate,
  submitDeleteAccount,
  settingsSelectors
} from '../../store/Applicant/settingsSlice';

import { authActions } from '../../store/authSlice';
import './Settings.css';

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const profile = useSelector(profileSelectors.getProfileForm);
  const loading = useSelector(settingsSelectors.getIsLoading);

  const email = localStorage.getItem('user_email');
  

  const isGoogleUser = profile.google_id || localStorage.getItem('is_google_user') === 'true';
  

  console.log('🔍 Google Auth Detection:', {
    profileGoogleId: profile.google_id,
    localStorageGoogleUser: localStorage.getItem('is_google_user'),
    isGoogleUser: isGoogleUser,
    profile: profile
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (email) {
      dispatch(fetchProfile(email));
    }
  }, [dispatch, email]);

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const confirmDelete = () => {
  dispatch(submitDeleteAccount({ email, navigate }))
    .then(() => {
      dispatch(authActions.logout()); 
      navigate("/"); 
    });
};

  const handleEmailSubmit = () => {
  if (newEmail !== confirmEmail) {
    alert('Emails do not match!');
    return;
  }

  dispatch(submitEmailUpdate({ newEmail, navigate }));
};


const handlePasswordSubmit = async () => {
  if (newPassword !== confirmPassword) {
    alert('New passwords do not match!');
    return;
  }

  try {
    const resultAction = await dispatch(submitPasswordUpdate({ oldPassword, newPassword }));

    unwrapResult(resultAction);


    alert('Password updated successfully! Please log in again.');
    dispatch(authActions.logout());
    navigate("/login");

  } catch (err) {
    console.log("The error object to inspect is:", err);
    alert("Your Current Password is Incorrect");
  }
};


const handleEmailChange = (field, value) => {
  if (field === 'newEmail') setNewEmail(value);
  if (field === 'confirmEmail') setConfirmEmail(value);
};

const handlePasswordChange = (field, value) => {
  if (field === 'oldPassword') setOldPassword(value);
  if (field === 'newPassword') setNewPassword(value);
  if (field === 'confirmPassword') setConfirmPassword(value);
};

const togglePasswordVisibility = (field) => {
  if (field === 'old') setShowOldPassword(!showOldPassword);
  if (field === 'new') setShowNewPassword(!showNewPassword);
  if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword);
};





  return (
    <>
      <div className="settings-page">
        <div className="settings-container">

          <div className="settings-header">
            <div className="header-content">
              <SettingsIcon className="page-icon" />
              <div>
                <h1 className="page-title">Account Settings</h1>
                <p className="page-subtitle">Manage your account preferences and data</p>
              </div>
            </div>
          </div>

          <div className="account-info-section">
            <div className="section-header">
              <User className="section-icon" />
              <h2 className="section-title">Account Information</h2>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading account information...</p>
              </div>
            ) : (
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <User size={20} />
                  </div>
                  <div className="info-content">
                    <label className="info-label">Full Name</label>
                    <span className="info-value">{profile.name || 'N/A'}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <Mail size={20} />
                  </div>
                  <div className="info-content">
                    <label className="info-label">Email Address</label>
                    <span className="info-value">{profile.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <Phone size={20} />
                  </div>
                  <div className="info-content">
                    <label className="info-label">Phone Number</label>
                    <span className="info-value">{profile.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="info-content">
                    <label className="info-label">Address</label>
                    <span className="info-value">{profile.address || 'N/A'}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <Shield size={20} />
                  </div>
                  <div className="info-content">
                    <label className="info-label">Account Status</label>
                    <span className="info-value status-active">Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>


          <div className="profile-section">
            <div className="section-header">
              <h3>Account Settings</h3>
            </div>
            <div className="section-content">
              <div className="settings-grid">

                {!isGoogleUser && (
                  <div className="settings-section">
                    <h2 className="section-title">
                      <Mail className="section-icon" />
                      Change Email Address
                    </h2>
                    <div className="settings-card">
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="newEmail" className="form-label">
                            New Email Address <span className="required">*</span>
                          </label>
                          <input
                            type="email"
                            id="newEmail"
                            value={newEmail}
                            onChange={(e) => handleEmailChange('newEmail', e.target.value)}
                            className="form-input"
                            placeholder="Enter new email address"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="confirmEmail" className="form-label">
                            Confirm New Email <span className="required">*</span>
                          </label>
                          <input
                            type="email"
                            id="confirmEmail"
                            value={confirmEmail}
                            onChange={(e) => handleEmailChange('confirmEmail', e.target.value)}
                            className="form-input"
                            placeholder="Confirm new email address"
                          />
                        </div>
                      </div>
                      <div className="form-actions">
                        <button
                          type="button"
                          className="save-btn"
                          onClick={handleEmailSubmit}
                          disabled={loading}
                        >
                          Update Email
                        </button>
                      </div>
                    </div>
                  </div>
                )}


                {!isGoogleUser && (
                  <div className="settings-section">
                    <h2 className="section-title">
                      <Lock className="section-icon" />
                      Change Password
                    </h2>
                    <div className="settings-card">
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="oldPassword" className="form-label">
                            Current Password <span className="required">*</span>
                          </label>
                          <input
                            type={showOldPassword ? 'text' : 'password'}
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                            className="form-input"
                            placeholder="Enter current password"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="newPassword" className="form-label">
                            New Password <span className="required">*</span>
                          </label>
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                            className="form-input"
                            placeholder="Enter new password"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="confirmPassword" className="form-label">
                            Confirm New Password <span className="required">*</span>
                          </label>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                            className="form-input"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      <div className="form-actions">
                        <button
                          type="button"
                          className="save-btn"
                          onClick={handlePasswordSubmit}
                          disabled={loading}
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                )}


                {isGoogleUser && (
                  <div className="settings-section">
                    <h2 className="section-title">
                      <Shield className="section-icon" />
                      Google Account
                    </h2>
                    <div className="settings-card">
                      <div className="google-auth-notice">
                        <p>Your account is managed through Google. Email and password changes must be made through your Google account settings.</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>


          <div className="danger-zone-section">
            <div className="section-header danger">
              <AlertTriangle className="section-icon danger-icon" />
              <div>
                <h2 className="section-title danger-title">Danger Zone</h2>
                <p className="section-subtitle">
                  Irreversible and destructive actions
                </p>
              </div>
            </div>

            <div className="danger-content">
              <div className="danger-warning">
                <AlertTriangle className="warning-icon" />
                <div className="warning-text">
                  <h3>Delete Account</h3>
                  <p>
                    Once you delete your account, there is no going back. This will permanently delete your profile, volunteer history, and achievements.
                  </p>
                </div>
              </div>

              <button
                className="delete-account-bt"
                onClick={toggleDeleteModal}
                disabled={loading}
              >
                <Trash2 size={20} />
                Delete My Account
              </button>
            </div>
          </div>


          {showDeleteModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <AlertTriangle className="modal-icon" />
                  <h3 className="modal-title">Confirm Account Deletion</h3>
                </div>

                <div className="modal-body">
                  <p>
                    Are you absolutely sure? This cannot be undone.
                  </p>
                  <div className="final-warning">
                    <strong>This action is permanent and irreversible!</strong>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="cancel-btn" onClick={toggleDeleteModal}>
                    Cancel
                  </button>
                  <button
                    className="confirm-delete-btn"
                    onClick={confirmDelete}
                    disabled={loading}
                  >
                    <Trash2 size={18} />
                    Yes, Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
