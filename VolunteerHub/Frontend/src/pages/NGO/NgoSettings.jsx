import React from 'react';
import { Settings, User, Mail, Lock, Trash2, Eye, EyeOff, AlertTriangle, CheckCircle, AlertCircle, Phone, MapPin, Globe, Target, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { submitEmailUpdate, submitPasswordUpdate, submitAccountDelete, ngoSettingsSelectors } from '../../store/NGO/Ngo_settingsSlice';
import { useEffect } from 'react';
import { fetchSettingsProfile } from '../../store/NGO/Ngo_settingsSlice';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../../store/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';

import './NgoSettings.css';


const NgoSettings = () => {

const dispatch = useDispatch();

const profileData = useSelector(ngoSettingsSelectors.getProfile);
const loading = useSelector(ngoSettingsSelectors.getIsLoading);
const error = useSelector(ngoSettingsSelectors.getError);

const isGoogleUser = profileData?.google_id || localStorage.getItem('is_google_user') === 'true';

useEffect(() => {
  dispatch(fetchSettingsProfile());
}, [dispatch]);


const navigate = useNavigate();


const [newEmail, setNewEmail] = useState('');
const [confirmEmail, setConfirmEmail] = useState('');

const [oldPassword, setOldPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

const [showOldPassword, setShowOldPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [showDeleteModal, setShowDeleteModal] = useState(false);

const [deleteConfirmationText, setDeleteConfirmationText] = useState('');




const handleEmailSubmit = () => {
  if (newEmail !== confirmEmail) {
    alert('Emails do not match!');
    return;
  }
  dispatch(submitEmailUpdate(newEmail)).then(() => {
    alert('Email updated successfully! Please login again.');
    dispatch(authActions.logout());
    navigate('/login');
  });
};


const handlePasswordSubmit = async () => {
  if (newPassword !== confirmPassword) {
    alert('New passwords do not match!');
    return;
  }

  try {
    const actionResult = await dispatch(submitPasswordUpdate({
      oldPassword: oldPassword,
      newPassword: newPassword
    }));
    unwrapResult(actionResult);

    alert('Password updated successfully! Please login again.');
    dispatch(authActions.logout());
    navigate('/login');

  } catch (err) {
    alert(err.message || 'Current Password is incorrect');
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

const openDeleteModal = () => setShowDeleteModal(true);
const closeDeleteModal = () => setShowDeleteModal(false);

const handleDeleteAccount = () => {
  if (deleteConfirmationText !== "DELETE") {
    alert('You must type DELETE exactly to confirm!');
    return;
  }
  dispatch(submitAccountDelete(deleteConfirmationText));
  navigate('/signup');
};


const success = null;
const validationErrors = {};



  return (
    <>
      <div className="settings-container ngo-settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <div className="header-content">
            <div className="header-title">
              <Settings className="header-icon" />
              <h1>Settings</h1>
            </div>
            <p className="header-subtitle">Manage your account and security settings</p>
          </div>
        </div>

        <div className="settings-content">
          {success && (
            <div className="alert alert-success">
              <CheckCircle className="alert-icon" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle className="alert-icon" />
              <span>{error}</span>
            </div>
          )}

          <div className="settings-section">
            <h2 className="section-title">
              <User className="section-icon" />
              Profile Information
            </h2>
            <div className="profile-info-card">
              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Organization Name</label>
                  <div className="info-value">{profileData.organizationName || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <label className="info-label">Contact Person</label>
                    <div className="info-value">{profileData.contactPersonName || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <label className="info-label">
                    <Mail className="info-icon" />
                    Email Address
                  </label>
                  <div className="info-value">{profileData.contactEmail || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <label className="info-label">
                    <Phone className="info-icon" />
                    Phone Number
                  </label>
                  <div className="info-value">{profileData.contactPhone || 'N/A'}</div>
                </div>
                <div className="info-item full-width">
                  <label className="info-label">
                    <MapPin className="info-icon" />
                    Address
                  </label>
                  <div className="info-value">{profileData.headOfficeAddress || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <label className="info-label">Service Regions</label>
                  <div className="info-value">{profileData.operatingRegions || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <label className="info-label">
                    <Globe className="info-icon" />
                    Website
                  </label>
                  <div className="info-value">{profileData.website || 'N/A'}</div>
                </div>
                <div className="info-item full-width">
                  <label className="info-label">
                    <Target className="info-icon" />
                    Mission
                  </label>
                  <div className="info-value">{profileData.missionStatement || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

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
                    className={`form-input ${validationErrors.newEmail ? 'error' : ''}`}
                    placeholder="Enter new email address"
                  />
                  {validationErrors.newEmail && (
                    <span className="error-message">{validationErrors.newEmail}</span>
                  )}
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
                    className={`form-input ${validationErrors.confirmEmail ? 'error' : ''}`}
                    placeholder="Confirm new email address"
                  />
                  {validationErrors.confirmEmail && (
                    <span className="error-message">{validationErrors.confirmEmail}</span>
                  )}
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  className="save-btn"
                  onClick={handleEmailSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="btn-loading">
                      <div className="loading-spinner"></div>
                      Updating...
                    </div>
                  ) : (
                    <>
                      <Mail className="btn-icon" />
                      Update Email
                    </>
                  )}
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
                  <div className="password-input-wrapper">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      id="oldPassword"
                      value={oldPassword}
                      onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                      className={`form-input ${validationErrors.oldPassword ? 'error' : ''}`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('old')}
                    >
                      {showOldPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                    </button>
                  </div>
                  {validationErrors.oldPassword && (
                    <span className="error-message">{validationErrors.oldPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">
                    New Password <span className="required">*</span>
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className={`form-input ${validationErrors.newPassword ? 'error' : ''}`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showNewPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                    </button>
                  </div>
                  {validationErrors.newPassword && (
                    <span className="error-message">{validationErrors.newPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm New Password <span className="required">*</span>
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showConfirmPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <span className="error-message">{validationErrors.confirmPassword}</span>
                  )}
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  className="save-btn"
                  onClick={handlePasswordSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="btn-loading">
                      <div className="loading-spinner"></div>
                      Updating...
                    </div>
                  ) : (
                    <>
                      <Lock className="btn-icon" />
                      Update Password
                    </>
                  )}
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

          <div className="settings-section danger-section">
            <h2 className="section-title danger-title">
              <Trash2 className="section-icon danger-icon" />
              Delete Account
            </h2>
            <div className="settings-card danger-card">
              <div className="danger-content">
                <div className="danger-warning">
                  <AlertTriangle className="warning-icon" />
                  <div>
                    <h3>This action cannot be undone!</h3>
                    <p>Deleting your account will permanently remove all your data, including opportunities, applications, and volunteer connections.</p>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button
                    type="button"
                    className="delete-bt"
                    onClick={openDeleteModal}
                  >
                    <Trash2 className="btn-icon" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="modal-overlay" onClick={closeDeleteModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <AlertTriangle className="modal-icon danger-icon" />
                <h3>Confirm Account Deletion</h3>
              </div>
              <div className="modal-body">
                <p>Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently remove:</p>
                <ul className="delete-list">
                  <li>All your organization data</li>
                  <li>Posted volunteer opportunities</li>
                  <li>Volunteer applications and connections</li>
                  <li>Account settings and preferences</li>
                </ul>
                <p className="final-warning">Type "DELETE" to confirm this action:</p>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type DELETE to confirm"
                   value={deleteConfirmationText}
                   onChange={(e) => setDeleteConfirmationText(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="confirm-delete-btn"
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="btn-loading">
                      <div className="loading-spinner"></div>
                      Deleting...
                    </div>
                  ) : (
                    <>
                      <Trash2 className="btn-icon" />
                      Delete Account
                    </>
                  )}
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

export default NgoSettings;