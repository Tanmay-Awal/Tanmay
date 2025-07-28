import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchSingleOpportunity, ngoOpportunitySelectors } from '../../store/NGO/Ngo_opportunitiesSlice';
import {
  fetchVolunteerProfile,
  fetchSingleApplication,
  ngoApplicationsSelectors,
  changeApplicationStatus
} from '../../store/NGO/Ngo_applicationsSlice';

import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, Award, CheckCircle, XCircle } from 'lucide-react';
import './ViewApplications.css';

const ViewApplications = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'ngo-portal-status-pending-xyz';
      case 'APPROVED': return 'ngo-portal-status-approved-xyz';
      case 'REJECTED': return 'ngo-portal-status-rejected-xyz';
      default: return 'ngo-portal-status-pending-xyz';
    }
  };

  const navigate = useNavigate();
  const { appId, oppId } = useParams();
  const dispatch = useDispatch();

  const profile = useSelector(ngoApplicationsSelectors.getVolunteerProfile);

  const application = useSelector(ngoApplicationsSelectors.getSingleApplication);
  const opportunity = useSelector(ngoOpportunitySelectors.getSingle);

  useEffect(() => {
    if (appId) dispatch(fetchSingleApplication(appId));
    if (oppId) dispatch(fetchSingleOpportunity(oppId));
  }, [dispatch, appId, oppId]);

  useEffect(() => {
    if (application?.volunteerId) {
      dispatch(fetchVolunteerProfile(application.volunteerId));
    }
  }, [dispatch, application?.volunteerId]);

  const applicationData = {
    volunteer: {
      fullName: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      about: profile?.bio || '',
      skills: profile?.skills || [],
      experience: profile?.pastExperience || ''
    },
    opportunity: {
      title: opportunity?.title || '',
      startDate: opportunity?.startDate || '',
      location: opportunity?.location || '',
      tags: opportunity?.tags || [],
      status: opportunity?.status || ''
    },
    applicationDate: application?.appliedDate || ''
  };

  const handleApprove = () => {
    dispatch(changeApplicationStatus({ appId, status: "Approved" }));
  };

  const handleReject = () => {
    dispatch(changeApplicationStatus({ appId, status: "Rejected" }));
  };

  const handleBack = () => {
    navigate('/ngo-applications');
  };
  return (
    <>
      <div className="ngo-portal-view-application-container-main-xyz">
        <div className="ngo-portal-view-application-header-section-xyz">
          <button className="ngo-portal-back-button-navigation-xyz" onClick={handleBack}>
            <ArrowLeft size={20} />
            Back to Applications
          </button>
        </div>

        <div className="ngo-portal-view-application-content-wrapper-xyz">
          <div className="ngo-portal-information-block-primary-xyz">
            <div className="ngo-portal-block-header-section-xyz">
              <User className="ngo-portal-block-icon-display-xyz" size={24} />
              <h2>Volunteer Information</h2>
            </div>

            <div className="ngo-portal-volunteer-profile-container-xyz">
              <div className="ngo-portal-profile-avatar-section-xyz">
                <div className="ngo-portal-avatar-circle-display-xyz">
                  {applicationData.volunteer.fullName?.charAt(0) || "?"}
                </div>
              </div>

              <div className="ngo-portal-profile-details-wrapper-xyz">
                <div className="ngo-portal-profile-main-content-xyz">
                  <h3 className="ngo-portal-volunteer-name-heading-xyz">{applicationData.volunteer.fullName}</h3>
                  <div className="ngo-portal-contact-info-container-xyz">
                    <div className="ngo-portal-contact-item-display-xyz">
                      <Mail size={16} />
                      <span>{applicationData.volunteer.email}</span>
                    </div>
                    <div className="ngo-portal-contact-item-display-xyz">
                      <Phone size={16} />
                      <span>{applicationData.volunteer.phone}</span>
                    </div>
                    <div className="ngo-portal-contact-item-display-xyz">
                      <MapPin size={16} />
                      <span>{applicationData.volunteer.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ngo-portal-about-section-container-xyz">
              <h4>About Volunteer</h4>
              <p className="ngo-portal-about-text-content-xyz">{applicationData.volunteer.about}</p>
            </div>

            <div className="ngo-portal-skills-section-wrapper-xyz">
              <h4>Skills & Interests</h4>
              <div className="ngo-portal-skills-container-display-xyz">
                {(applicationData.volunteer.skills || []).map((skill, index) => (
                  <span key={index} className="ngo-portal-skill-chip-element-xyz">{skill}</span>
                ))}
              </div>
            </div>

            <div className="ngo-portal-experience-section-block-xyz">
              <h4>Past Experience</h4>
              <div className="ngo-portal-experience-content-wrapper-xyz">
                <Award className="ngo-portal-experience-icon-display-xyz" size={20} />
                {Array.isArray(applicationData.volunteer.experience) && applicationData.volunteer.experience.length > 0 ? (
                  <ul className="ngo-portal-experience-text-content-xyz">
                    {applicationData.volunteer.experience.map((exp, index) => (
                      <li key={index}>
                        <strong>{exp.post}</strong> at {exp.organization} — {exp.description} ({exp.timeRange})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ngo-portal-experience-text-content-xyz">No experience added.</p>
                )}
              </div>
            </div>
          </div>

          <div className="ngo-portal-information-block-secondary-xyz">
            <div className="ngo-portal-block-header-section-xyz">
              <CheckCircle className="ngo-portal-block-icon-display-xyz" size={24} />
              <h2>Opportunity Information</h2>
            </div>

            <div className="ngo-portal-opportunity-details-container-xyz">
              <div className="ngo-portal-opportunity-title-wrapper-xyz">
                <h3>{applicationData.opportunity.title}</h3>
                <span className={`ngo-portal-status-badge-display-xyz ${getStatusColor(applicationData.opportunity.status)}`}>
                  {applicationData.opportunity.status}
                </span>
              </div>

              <div className="ngo-portal-opportunity-meta-section-xyz">
                <div className="ngo-portal-meta-item-container-xyz">
                  <Calendar size={16} />
                  <div className="ngo-portal-meta-content-wrapper-xyz">
                    <span className="ngo-portal-meta-label-text-xyz">Start Date</span>
                    <span className="ngo-portal-meta-value-display-xyz">
                      {applicationData.opportunity.startDate ? new Date(applicationData.opportunity.startDate).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>

                <div className="ngo-portal-meta-item-container-xyz">
                  <MapPin size={16} />
                  <div className="ngo-portal-meta-content-wrapper-xyz">
                    <span className="ngo-portal-meta-label-text-xyz">Location</span>
                    <span className="ngo-portal-meta-value-display-xyz">{applicationData.opportunity.location}</span>
                  </div>
                </div>

                <div className="ngo-portal-meta-item-container-xyz">
                  <Calendar size={16} />
                  <div className="ngo-portal-meta-content-wrapper-xyz">
                    <span className="ngo-portal-meta-label-text-xyz">Applied Date</span>
                    <span className="ngo-portal-meta-value-display-xyz">
                      {applicationData.applicationDate ? new Date(applicationData.applicationDate).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="ngo-portal-opportunity-tags-section-xyz">
                <h4>Tags</h4>
                <div className="ngo-portal-tags-container-display-xyz">
                  {(applicationData.opportunity.tags || []).map((tag, index) => (
                    <span key={index} className="ngo-portal-tag-chip-element-xyz">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewApplications;
