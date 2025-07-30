import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Building2, User, Mail, Phone, MapPin, Globe, Target, Facebook, Instagram, Linkedin, Edit3, Save, Plus, ExternalLink
} from 'lucide-react';
import './NgoProfile.css';
import { fetchNgoProfile, submitNgoProfile } from '../../store/NGO/Ngo_profileSlice';
import { ngoProfileSelectors } from '../../store/NGO/Ngo_profileSlice';
import { useNavigate } from 'react-router-dom';
const NgoProfile = () => {
  const dispatch = useDispatch();
  const ngoProfile = useSelector(ngoProfileSelectors.getForm);
  const navigate = useNavigate();

  const [isEditingOrgName, setIsEditingOrgName] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');

  const [isEditingContactPerson, setIsEditingContactPerson] = useState(false);
  const [newContactPerson, setNewContactPerson] = useState('');

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  const [isEditingRegions, setIsEditingRegions] = useState(false);
  const [newRegions, setNewRegions] = useState('');

  const [isEditingMapsLink, setIsEditingMapsLink] = useState(false);
  const [newMapsLink, setNewMapsLink] = useState('');

  const [isEditingMission, setIsEditingMission] = useState(false);
  const [newMission, setNewMission] = useState('');

  const [isEditingWebsite, setIsEditingWebsite] = useState(false);
  const [newWebsite, setNewWebsite] = useState('');

  const [isEditingFacebook, setIsEditingFacebook] = useState(false);
  const [newFacebook, setNewFacebook] = useState('');

  const [isEditingInstagram, setIsEditingInstagram] = useState(false);
  const [newInstagram, setNewInstagram] = useState('');

  const [isEditingLinkedin, setIsEditingLinkedin] = useState(false);
  const [newLinkedin, setNewLinkedin] = useState('');

  useEffect(() => {
    dispatch(fetchNgoProfile());
  }, [dispatch]);

  const handleSaveOrgName = () => {
    if (!newOrgName.trim()) return;
    dispatch(submitNgoProfile({ organizationName: newOrgName }));
    setIsEditingOrgName(false);
  };

  const handleSaveContactPerson = () => {
    if (!newContactPerson.trim()) return;
    dispatch(submitNgoProfile({ contactPersonName: newContactPerson }));
    setIsEditingContactPerson(false);
  };

  const handleSaveEmail = () => {
    if (!newEmail.trim()) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      alert('Please enter a valid email address');
      return;
    }
    dispatch(submitNgoProfile({ contactEmail: newEmail }));
    setIsEditingEmail(false);
  };

  const handleSavePhone = () => {
    if (!newPhone.trim()) return;
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(newPhone)) {
      alert('Please enter a valid phone number (7–15 digits)');
      return;
    }
    dispatch(submitNgoProfile({ contactPhone: newPhone }));
    setIsEditingPhone(false);
  };

  const handleSaveAddress = () => {
    if (!newAddress.trim()) return;
    dispatch(submitNgoProfile({ headOfficeAddress: newAddress }));
    setIsEditingAddress(false);
  };

  const handleSaveRegions = () => {
    if (!newRegions.trim()) return;
    dispatch(submitNgoProfile({ operatingRegions: newRegions }));
    setIsEditingRegions(false);
  };

  const handleSaveMapsLink = () => {
    if (!newMapsLink.trim()) return;
    dispatch(submitNgoProfile({ googleMapsLink: newMapsLink }));
    setIsEditingMapsLink(false);
  };

  const handleSaveMission = () => {
    if (!newMission.trim()) return;
    dispatch(submitNgoProfile({ missionStatement: newMission }));
    setIsEditingMission(false);
  };

  const handleSaveWebsite = () => {
    if (!newWebsite.trim()) return;
    dispatch(submitNgoProfile({ website: newWebsite }));
    setIsEditingWebsite(false);
  };

  const handleSaveFacebook = () => {
    if (!newFacebook.trim()) return;
    dispatch(submitNgoProfile({ facebook: newFacebook }));
    setIsEditingFacebook(false);
  };

  const handleSaveInstagram = () => {
    if (!newInstagram.trim()) return;
    dispatch(submitNgoProfile({ instagram: newInstagram }));
    setIsEditingInstagram(false);
  };

  const handleSaveLinkedin = () => {
    if (!newLinkedin.trim()) return;
    dispatch(submitNgoProfile({ linkedin: newLinkedin }));
    setIsEditingLinkedin(false);
  };

  const handleSaveAllChanges = () => {
    alert('All changes saved successfully!');
    navigate('/ngo-dashboard'); 
  };

  return (
    <>
      <div className="ngo-profile-page">
        <div className="ngo-profile-header">
          <div className="header-content">
            <h1>NGO Profile</h1>
            <p>Manage your organization's information and showcase your mission</p>
          </div>
        </div>

        <div className="ngo-profile-container">
          
          <div className="ngo-profile-card">
            {isEditingOrgName && (
              <div className="org-name-input-container">
                <input
                  type="text"
                  placeholder="Enter organization name"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                />
              </div>
            )}

            {!ngoProfile.organizationName && !isEditingOrgName && (
              <button
                className="add-btn add-org-name-btn"
                onClick={() => setIsEditingOrgName(true)}
              >
                <Plus size={16} /> Add Organization Name
              </button>
            )}

            {ngoProfile.organizationName && !isEditingOrgName && (
              <button
                className="edit-org-name-btn"
                onClick={() => {
                  setNewOrgName(ngoProfile.organizationName);
                  setIsEditingOrgName(true);
                }}
              >
                <Edit3 size={16} /> Edit
              </button>
            )}

            <div className="ngo-basic-info">
              {!isEditingOrgName && (
                <h2 className="ngo-name">{ngoProfile.organizationName || 'N/A'}</h2>
              )}
              <div className="ngo-stats">
                <div className="stat-item">
                  <Building2 className="stat-icon" />
                  <span>Organization Profile</span>
                </div>
                <div className="stat-item">
                  <Target className="stat-icon" />
                  <span>Making Impact</span>
                </div>
              </div>
            </div>

            {isEditingOrgName && (
              <button className="save-btn save-org-name-btn" onClick={handleSaveOrgName}>
                <Save size={16} /> Save
              </button>
            )}
          </div>

          
          <div className="ngo-profile-section">
            <div className="section-header">
              <h3>Contact Information</h3>
            </div>
            <div className="section-content">
              <div className="info-grid">
                
                
                <div className="info-item">
                  <User className="info-icon" />
                  <div className="info-content">
                    <label>Contact Person</label>
                    {!isEditingContactPerson ? (
                      <span>{ngoProfile.contactPersonName || 'N/A'}</span>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter contact person name"
                        value={newContactPerson}
                        onChange={(e) => setNewContactPerson(e.target.value)}
                      />
                    )}

                    {!ngoProfile.contactPersonName && !isEditingContactPerson && (
                      <button
                        className="edit-btn"
                        onClick={() => setIsEditingContactPerson(true)}
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}

                    {ngoProfile.contactPersonName && !isEditingContactPerson && (
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setNewContactPerson(ngoProfile.contactPersonName);
                          setIsEditingContactPerson(true);
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}

                    {isEditingContactPerson && (
                      <button
                        className="save-btn"
                        onClick={handleSaveContactPerson}
                      >
                        <Save size={14} /> Save
                      </button>
                    )}
                  </div>
                </div>

                
                <div className="info-item">
                  <Mail className="info-icon" />
                  <div className="info-content">
                    <label>Contact Email</label>
                    {!isEditingEmail ? (
                      <span>{ngoProfile.contactEmail || 'N/A'}</span>
                    ) : (
                      <input
                        type="email"
                        placeholder="Enter contact email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                    )}

                    {!ngoProfile.contactEmail && !isEditingEmail && (
                      <button
                        className="edit-btn"
                        onClick={() => setIsEditingEmail(true)}
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}

                    {ngoProfile.contactEmail && !isEditingEmail && (
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setNewEmail(ngoProfile.contactEmail);
                          setIsEditingEmail(true);
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}

                    {isEditingEmail && (
                      <button
                        className="save-btn"
                        onClick={handleSaveEmail}
                      >
                        <Save size={14} /> Save
                      </button>
                    )}
                  </div>
                </div>

                
                <div className="info-item">
                  <Phone className="info-icon" />
                  <div className="info-content">
                    <label>Contact Phone</label>
                    {!isEditingPhone ? (
                      <span>{ngoProfile.contactPhone || 'N/A'}</span>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter contact phone"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                      />
                    )}

                    {!ngoProfile.contactPhone && !isEditingPhone && (
                      <button
                        className="edit-btn"
                        onClick={() => setIsEditingPhone(true)}
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}

                    {ngoProfile.contactPhone && !isEditingPhone && (
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setNewPhone(ngoProfile.contactPhone);
                          setIsEditingPhone(true);
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}

                    {isEditingPhone && (
                      <button
                        className="save-btn"
                        onClick={handleSavePhone}
                      >
                        <Save size={14} /> Save
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Address & Location */}
          <div className="ngo-profile-section">
            <div className="section-header">
              <h3>Address & Location</h3>
            </div>
            <div className="section-content">
              <div className="info-grid">
                
                
                <div className="info-item">
                  <MapPin className="info-icon" />
                  <div className="info-content">
                    <label>Head Office Address</label>
                    {!isEditingAddress ? (
                      <span>{ngoProfile.headOfficeAddress || 'N/A'}</span>
                    ) : (
                      <textarea
                        placeholder="Enter head office address"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                      />
                    )}

                    {!ngoProfile.headOfficeAddress && !isEditingAddress && (
                      <button
                        className="edit-btn"
                        onClick={() => setIsEditingAddress(true)}
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}

                    {ngoProfile.headOfficeAddress && !isEditingAddress && (
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setNewAddress(ngoProfile.headOfficeAddress);
                          setIsEditingAddress(true);
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}

                    {isEditingAddress && (
                      <button
                        className="save-btn"
                        onClick={handleSaveAddress}
                      >
                        <Save size={14} /> Save
                      </button>
                    )}
                  </div>
                </div>

                
                <div className="info-item">
                  <Globe className="info-icon" />
                  <div className="info-content">
                    <label>Operating Regions</label>
                    {!isEditingRegions ? (
                      <span>{ngoProfile.operatingRegions || 'N/A'}</span>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter operating regions"
                        value={newRegions}
                        onChange={(e) => setNewRegions(e.target.value)}
                      />
                    )}

                    {!ngoProfile.operatingRegions && !isEditingRegions && (
                      <button
                        className="edit-btn"
                        onClick={() => setIsEditingRegions(true)}
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}

                    {ngoProfile.operatingRegions && !isEditingRegions && (
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setNewRegions(ngoProfile.operatingRegions);
                          setIsEditingRegions(true);
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}

                    {isEditingRegions && (
                      <button
                        className="save-btn"
                        onClick={handleSaveRegions}
                      >
                        <Save size={14} /> Save
                      </button>
                    )}
                  </div>
                </div>

                
                <div className="info-item">
                  <ExternalLink className="info-icon" />
                  <div className="info-content">
                    <label>Google Maps Link</label>
                    {!isEditingMapsLink ? (
                      <span>{ngoProfile.googleMapsLink || 'N/A'}</span>
                    ) : (
                      <input
                        type="url"
                        placeholder="Enter Google Maps link"
                        value={newMapsLink}
                        onChange={(e) => setNewMapsLink(e.target.value)}
                      />
                    )}

                    {!ngoProfile.googleMapsLink && !isEditingMapsLink && (
                      <button
                        className="edit-btn"
                        onClick={() => setIsEditingMapsLink(true)}
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}

                    {ngoProfile.googleMapsLink && !isEditingMapsLink && (
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setNewMapsLink(ngoProfile.googleMapsLink);
                          setIsEditingMapsLink(true);
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}

                    {isEditingMapsLink && (
                      <button
                        className="save-btn"
                        onClick={handleSaveMapsLink}
                      >
                        <Save size={14} /> Save
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          
          <div className="ngo-profile-section">
            <div className="section-header">
              <h3>Mission Statement</h3>
              {ngoProfile.missionStatement && !isEditingMission ? (
                <button
                  className="edit-btn"
                  onClick={() => {
                    setNewMission(ngoProfile.missionStatement);
                    setIsEditingMission(true);
                  }}
                >
                  <Edit3 size={16} /> Edit
                </button>
              ) : !isEditingMission ? (
                <button
                  className="edit-btn"
                  onClick={() => setIsEditingMission(true)}
                >
                  <Plus size={16} /> Add
                </button>
              ) : null}
            </div>

            <div className="section-content mission-section-content">
              {!isEditingMission ? (
                <div className="mission-content">
                  <p>{ngoProfile.missionStatement || 'N/A'}</p>
                </div>
              ) : (
                <div className="mission-input-container">
                  <textarea
                    placeholder="Write your organization's mission statement..."
                    value={newMission}
                    onChange={(e) => setNewMission(e.target.value)}
                  />
                  <button
                    className="save-btn save-mission-btn"
                    onClick={handleSaveMission}
                  >
                    <Save size={16} /> Save
                  </button>
                </div>
              )}
            </div>
          </div>


          <div className="ngo-profile-section">
            <div className="section-header">
              <h3>Website & Social Media</h3>
            </div>
            <div className="section-content">
              <div className="info-grid">
                
                
                <div className="info-item">
                  <Globe className="info-icon" />
                  <div className="info-content">
                    <label>Website</label>
                    {!isEditingWebsite ? (
                      <span>{ngoProfile.website || 'N/A'}</span>
                    ) : (
                      <input
                        type="url"
                        placeholder="Enter website URL"
                        value={newWebsite}
                        onChange={(e) => setNewWebsite(e.target.value)}
                      />
                    )}

                    {!ngoProfile.website && !isEditingWebsite && (
                      <button
                        className="edit-btn"
                        onClick={() => setIsEditingWebsite(true)}
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}

                    {ngoProfile.website && !isEditingWebsite && (
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setNewWebsite(ngoProfile.website);
                          setIsEditingWebsite(true);
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}

                    {isEditingWebsite && (
                      <button
                        className="save-btn"
                        onClick={handleSaveWebsite}
                      >
                        <Save size={14} /> Save
                      </button>
                    )}
                  </div>
                </div>

                
                <div className="info-item">
                  <Facebook className="info-icon" />
                  <div className="info-content">
                    <label>Facebook</label>
                    {!isEditingFacebook ? (
                      <span>{ngoProfile.facebook || 'N/A'}</span>
                    ) : (
                      <input
                        type="url"
                        placeholder="Enter Facebook URL"
                        value={newFacebook}
                        onChange={(e) => setNewFacebook(e.target.value)}
                      />
                    )}

                    {!ngoProfile.facebook && !isEditingFacebook && (
                      <button
                        className="edit-btn"
                        onClick={() => setIsEditingFacebook(true)}
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}

                    {ngoProfile.facebook && !isEditingFacebook && (
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setNewFacebook(ngoProfile.facebook);
                          setIsEditingFacebook(true);
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}

                    {isEditingFacebook && (
                      <button
                        className="save-btn"
                        onClick={handleSaveFacebook}
                      >
                        <Save size={14} /> Save
                      </button>
                    )}
                  </div>
                </div>

                
                <div className="info-item">
                  <Instagram className="info-icon" />
                  <div className="info-content">
                    <label>Instagram</label>
                    {!isEditingInstagram ? (
                      <span>{ngoProfile.instagram || 'N/A'}</span>
                    ) : (
                      <input
                        type="url"
                        placeholder="Enter Instagram URL"
                        value={newInstagram}
                        onChange={(e) => setNewInstagram(e.target.value)}
                      />
                    )}

                    {!ngoProfile.instagram && !isEditingInstagram && (
                      <button
                        className="edit-btn"
                        onClick={() => setIsEditingInstagram(true)}
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}

                    {ngoProfile.instagram && !isEditingInstagram && (
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setNewInstagram(ngoProfile.instagram);
                          setIsEditingInstagram(true);
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}

                    {isEditingInstagram && (
                      <button
                        className="save-btn"
                        onClick={handleSaveInstagram}
                      >
                        <Save size={14} /> Save
                      </button>
                    )}
                  </div>
                </div>

                
                <div className="info-item">
                  <Linkedin className="info-icon" />
                  <div className="info-content">
                    <label>LinkedIn</label>
                    {!isEditingLinkedin ? (
                      <span>{ngoProfile.linkedin || 'N/A'}</span>
                    ) : (
                      <input
                        type="url"
                        placeholder="Enter LinkedIn URL"
                        value={newLinkedin}
                        onChange={(e) => setNewLinkedin(e.target.value)}
                      />
                    )}

                    {!ngoProfile.linkedin && !isEditingLinkedin && (
                      <button
                        className="edit-btn"
                        onClick={() => setIsEditingLinkedin(true)}
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}

                    {ngoProfile.linkedin && !isEditingLinkedin && (
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setNewLinkedin(ngoProfile.linkedin);
                          setIsEditingLinkedin(true);
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}

                    {isEditingLinkedin && (
                      <button
                        className="save-btn"
                        onClick={handleSaveLinkedin}
                      >
                        <Save size={14} /> Save
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          
          <div className="save-all-section">
            <button className="save-all-btn" onClick={handleSaveAllChanges}>
              <Save size={20} /> Save All Changes
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default NgoProfile;