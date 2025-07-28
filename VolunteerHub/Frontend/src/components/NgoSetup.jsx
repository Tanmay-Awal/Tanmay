import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signupSelectors, signupActions, submitNgoDetails } from '../store/signupSlice';
import { useNavigate } from 'react-router-dom';

import {
  ChevronRight,
  ChevronLeft,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Target,
  CheckCircle
} from 'lucide-react';

import './NgoSetup.css';

const NgoSetup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ngoFormData = useSelector(signupSelectors.getNgoForm);
  const isLoading = useSelector(signupSelectors.getIsLoading);

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    dispatch(signupActions.updateNgoField({ field, value }));
    setError('');
  };

  const isValidEmail = (email) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim());

  const isValidPhone = (phone) =>
    /^[0-9+\-\s()]{7,20}$/.test(phone.trim());

  const isValidURL = (url) =>
    !url || /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url.trim());

  const validateStep = (step) => {
    if (step === 1) {
      if (
        !ngoFormData.organizationName.trim() ||
        !ngoFormData.contactPersonName.trim() ||
        !ngoFormData.contactEmail.trim() ||
        !ngoFormData.contactPhone.trim()
      ) {
        setError('Please fill in all required fields.');
        return false;
      }
      if (!isValidEmail(ngoFormData.contactEmail)) {
        setError('Please enter a valid email.');
        return false;
      }
      if (!isValidPhone(ngoFormData.contactPhone)) {
        setError('Please enter a valid phone number.');
        return false;
      }
    }

    if (step === 2) {
      if (
        !ngoFormData.headOfficeAddress.trim() ||
        !ngoFormData.operatingRegions.trim()
      ) {
        setError('Please fill in all required fields.');
        return false;
      }
      if (
        ngoFormData.googleMapsLink &&
        !isValidURL(ngoFormData.googleMapsLink)
      ) {
        setError('Please enter a valid Google Maps URL.');
        return false;
      }
    }

    if (step === 3) {
      if (!ngoFormData.missionStatement.trim()) {
        setError('Please enter your mission statement.');
        return false;
      }

      const urls = [ngoFormData.website, ngoFormData.facebook, ngoFormData.instagram, ngoFormData.linkedin];
      for (let link of urls) {
        if (link && !isValidURL(link)) {
          setError('Please enter valid URLs for website or social links.');
          return false;
        }
      }
    }

    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      dispatch(submitNgoDetails({ formData: ngoFormData, navigate }));
    }
  };

  const steps = [
    { id: 1, title: 'Basic Information', icon: Building2 },
    { id: 2, title: 'Location Details', icon: MapPin },
    { id: 3, title: 'Mission & Social', icon: Target },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="ngo-wizard-step-fields">
            <div className="ngo-wizard-field-group">
              <label className="ngo-wizard-field-label">
                <Building2 className="ngo-wizard-label-icon" /> Organization Name *
              </label>
              <input
                type="text"
                className="ngo-wizard-text-input"
                value={ngoFormData.organizationName}
                placeholder="Organization Name"
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
              />
            </div>

            <div className="ngo-wizard-field-group">
              <label className="ngo-wizard-field-label">
                <User className="ngo-wizard-label-icon" /> Contact Person Name *
              </label>
              <input
                type="text"
                className="ngo-wizard-text-input"
                value={ngoFormData.contactPersonName}
                placeholder="Contact Person Name"
                onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
              />
            </div>

            <div className="ngo-wizard-field-group">
              <label className="ngo-wizard-field-label">
                <Mail className="ngo-wizard-label-icon" /> Contact Email *
              </label>
              <input
                type="email"
                className="ngo-wizard-text-input"
                value={ngoFormData.contactEmail}
                placeholder="Contact Email"
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              />
            </div>

            <div className="ngo-wizard-field-group">
              <label className="ngo-wizard-field-label">
                <Phone className="ngo-wizard-label-icon" /> Contact Phone *
              </label>
              <input
                type="tel"
                className="ngo-wizard-text-input"
                value={ngoFormData.contactPhone}
                placeholder="Contact Phone"
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="ngo-wizard-step-fields">
            <div className="ngo-wizard-field-group">
              <label className="ngo-wizard-field-label">
                <MapPin className="ngo-wizard-label-icon" /> Head Office Address *
              </label>
              <textarea
                className="ngo-wizard-textarea-input"
                value={ngoFormData.headOfficeAddress}
                placeholder="Head Office Address"
                onChange={(e) => handleInputChange('headOfficeAddress', e.target.value)}
              />
            </div>

            <div className="ngo-wizard-field-group">
              <label className="ngo-wizard-field-label">
                <Globe className="ngo-wizard-label-icon" /> Operating Regions *
              </label>
              <textarea
                className="ngo-wizard-textarea-input"
                value={ngoFormData.operatingRegions}
                placeholder="Operating Regions"
                onChange={(e) => handleInputChange('operatingRegions', e.target.value)}
              />
            </div>

            <div className="ngo-wizard-field-group">
              <label className="ngo-wizard-field-label">
                <MapPin className="ngo-wizard-label-icon" /> Google Maps Link (Optional)
              </label>
              <input
                type="url"
                className="ngo-wizard-text-input"
                value={ngoFormData.googleMapsLink}
                placeholder="Google Maps Link"
                onChange={(e) => handleInputChange('googleMapsLink', e.target.value)}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="ngo-wizard-step-fields">
            <div className="ngo-wizard-field-group">
              <label className="ngo-wizard-field-label">
                <Target className="ngo-wizard-label-icon" /> Mission Statement *
              </label>
              <textarea
                className="ngo-wizard-textarea-input"
                value={ngoFormData.missionStatement}
                placeholder="Mission Statement"
                onChange={(e) => handleInputChange('missionStatement', e.target.value)}
              />
            </div>

            <div className="ngo-wizard-field-group">
              <label className="ngo-wizard-field-label">
                <Globe className="ngo-wizard-label-icon" /> Website (Optional)
              </label>
              <input
                type="url"
                className="ngo-wizard-text-input"
                value={ngoFormData.website}
                placeholder="Website"
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>

            <div className="ngo-wizard-social-grid">
              <div className="ngo-wizard-field-group">
                <label className="ngo-wizard-field-label">Facebook</label>
                <input
                  type="url"
                  className="ngo-wizard-text-input"
                  value={ngoFormData.facebook}
                  placeholder="Facebook URL"
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                />
              </div>

              <div className="ngo-wizard-field-group">
                <label className="ngo-wizard-field-label">Instagram</label>
                <input
                  type="url"
                  className="ngo-wizard-text-input"
                  value={ngoFormData.instagram}
                  placeholder="Instagram URL"
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                />
              </div>

              <div className="ngo-wizard-field-group">
                <label className="ngo-wizard-field-label">LinkedIn</label>
                <input
                  type="url"
                  className="ngo-wizard-text-input"
                  value={ngoFormData.linkedin}
                  placeholder="LinkedIn URL"
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ngo-wizard-main-container">
      <div className="ngo-wizard-content-wrapper">
        <div className="ngo-wizard-page-header">
          <h1 className="ngo-wizard-page-title">Complete NGO Setup</h1>
        </div>
        <div className="ngo-wizard-progress-wrapper">
          <div className="ngo-wizard-step-indicators">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <React.Fragment key={step.id}>
                  <div className={`ngo-wizard-step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                    <div className="ngo-wizard-step-badge">
                      {isCompleted ? <CheckCircle className="ngo-wizard-step-badge-icon" /> : <Icon className="ngo-wizard-step-badge-icon" />}
                    </div>
                    <span className="ngo-wizard-step-label">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`ngo-wizard-progress-connector ${isCompleted ? 'completed' : ''}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="ngo-wizard-form-container">
          <div className="ngo-wizard-form-header-section">
            <h2 className="ngo-wizard-form-heading">
              Step {currentStep}: {steps[currentStep - 1].title}
            </h2>
          </div>
          <div className="ngo-wizard-form-content">
            {renderStepContent()}

            {error && (
              <div className="ngo-wizard-error-alert">
                <p>{error}</p>
              </div>
            )}

            <div className="ngo-wizard-button-controls">
              <button 
                className={`ngo-wizard-control-button ngo-wizard-back-button ${currentStep === 1 ? 'disabled' : ''}`}
                onClick={prevStep} 
                disabled={currentStep === 1}
              >
                <ChevronLeft className="ngo-wizard-button-icon" /> Previous
              </button>
              {currentStep < 3 ? (
                <button 
                  className="ngo-wizard-control-button ngo-wizard-forward-button"
                  onClick={nextStep}
                >
                  Next <ChevronRight className="ngo-wizard-button-icon" />
                </button>
              ) : (
                <button 
                  className={`ngo-wizard-control-button ngo-wizard-finish-button ${isLoading ? 'loading' : ''}`}
                  onClick={handleSubmit} 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="ngo-wizard-loading-spinner"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="ngo-wizard-button-icon" />
                      Complete Setup
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="ngo-wizard-page-footer">
          <p>All information will be kept secure and confidential.</p>
        </div>
      </div>
    </div>
  );
};

export default NgoSetup;