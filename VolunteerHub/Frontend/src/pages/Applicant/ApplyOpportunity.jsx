import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createApplication, applicationsSelectors } from "../../store/Applicant/applicationsSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Eye, Edit, Trash2 } from 'lucide-react';

import { getSingleOpportunity, checkProfileComplete } from "../../services/Applicant/opportunityService";

import './ApplyOpportunity.css';

const ApplyOpportunity = () => {

   const { id } = useParams();
const dispatch = useDispatch();
const navigate = useNavigate();
const volunteerEmail = useSelector((state) => state.auth.user.email);
console.log("🔍 ApplyOpportunity - volunteerEmail from Redux:", volunteerEmail);
console.log("🔍 ApplyOpportunity - localStorage user_email:", localStorage.getItem('user_email'));
const applyLoading = useSelector(applicationsSelectors.getApplyLoading);



const [opportunityData, setOpportunityData] = React.useState(null);
const [profileComplete, setProfileComplete] = React.useState(true);
const [profileLoading, setProfileLoading] = React.useState(true);

useEffect(() => {
  const checkProfile = async () => {
    try {
      const profileData = await checkProfileComplete();
      setProfileComplete(profileData.is_complete);
    } catch (err) {
      console.error("Error checking profile:", err);
      setProfileComplete(false);
    } finally {
      setProfileLoading(false);
    }
  };

  checkProfile();
}, []);

useEffect(() => {
  getSingleOpportunity(id)
    .then(res => setOpportunityData(res.data))
    .catch(err => {
      console.error(err);
      navigate("/opportunities");  
    });
}, [id, navigate]);


if (!opportunityData) return <div>Loading...</div>;


const handleApply = async () => {
  if (!profileComplete) {
    toast.error("Please complete your profile before applying for opportunities.");
    return;
  }

  try {
    await dispatch(createApplication({
      opportunityId: id,
      volunteerEmail,
      message: "",
    })).unwrap();

    toast.success("Applied successfully!");

    navigate("/opportunities");

  } catch (err) {
    console.error(err);
    if (err.message && err.message.includes("Profile incomplete")) {
      toast.error("Please complete your profile before applying for opportunities.");
    } else {
      toast.error("Failed to apply.");
    }
  }
};



  return (
    <>
      <div className="view-opportunity-container">
        <div className="view-opportunity-content">
          <div className="opportunity-main">
            <div className="opportunity-image-section">
              <img 
                src={`http://localhost:5000/uploads/${opportunityData.image}`}  
                alt={opportunityData.title}
                className="opportunity-image"
              />
              <div className="status-badge-container">
                  <span className={`status-badge ${opportunityData.status?.toLowerCase() || "unknown"}`}>
                      {opportunityData.status || "Unknown"}
                  </span>
              </div>

            </div>

            <div className="opportunity-details">
              <div className="title-section">
                <h1 className="opportunity-titlee">{opportunityData.title}</h1>
              </div>

              <div className="ngo-details-section">
                <h3 className="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                  About Organization
                </h3>
                <div className="ngo-info-grid">
                  <div className="ngo-info-card">
                    <div className="ngo-info-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <h4>Organization</h4>
                    </div>
                    <p className="ngo-info-value">{opportunityData.organizationName}</p>
                  </div>

                  <div className="ngo-info-card">
                    <div className="ngo-info-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <h4>Contact Person</h4>
                    </div>
                    <p className="ngo-info-value">{opportunityData.contactPersonName}</p>
                  </div>

                  <div className="ngo-info-card">
                    <div className="ngo-info-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <h4>Email</h4>
                    </div>
                    <p className="ngo-info-value">{opportunityData.contactEmail}</p>
                  </div>

                  <div className="ngo-info-card">
                    <div className="ngo-info-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <h4>Phone</h4>
                    </div>
                    <p className="ngo-info-value">{opportunityData.contactPhone}</p>
                  </div>

                  <div className="ngo-info-card">
                    <div className="ngo-info-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <h4>Head Office</h4>
                    </div>
                    <p className="ngo-info-value">{opportunityData.headOfficeAddress}</p>
                  </div>

                  <div className="ngo-info-card">
                    <div className="ngo-info-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                      <h4>Operating Regions</h4>
                    </div>
                    <p className="ngo-info-value">{opportunityData.operatingRegions}</p>
                  </div>
                </div>

                <div className="mission-statement">
                  <h4 className="mission-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Mission Statement
                  </h4>
                  <p className="mission-content">{opportunityData.missionStatement}</p>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-card">
                  <div className="detail-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    <h3>Start Date</h3>
                  </div>
                  <p className="detail-value">{opportunityData.startDate.split('T')[0]}</p>
                </div>

                <div className="detail-card">
                  <div className="detail-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <h3>Location</h3>
                  </div>
                  <p className="detail-value">{opportunityData.location}</p>
                </div>

                <div className="detail-card">
                  <div className="detail-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <h3>Current Status</h3>
                  </div>
                  <p className="detail-value status-text">
                      {opportunityData.status === "Open" ? "Active" : "Inactive"}
                  </p>

                </div>
              </div>

              <div className="description-section">
                <h3 className="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  Full Description
                </h3>
                <div className="description-content">
                  <p>{opportunityData.description}</p>
                </div>
              </div>

              <div className="tags-section">
                <h3 className="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  Tags
                </h3>
                <div className="tags-container">
                  {opportunityData.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="apply-button-container">
              <button 
                className="apply-btnn" 
                onClick={handleApply} 
                disabled={applyLoading || profileLoading || !profileComplete}
              >
                  {applyLoading ? (
                      <>
                      <svg className="spinner" width="18" height="18" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" />
                      </svg>
                      Applying...
                      </>
                  ) : !profileComplete ? (
                      <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      Complete Profile First
                      </>
                  ) : (
                      <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 11l3 3l8-8"/>
                          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02"/>
                      </svg>
                      Apply Now
                      </>
                  )}
              </button>

              {!profileComplete && (
                <div className="profile-warning">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <span>Please complete your profile before applying</span>
                </div>
              )}

            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyOpportunity;