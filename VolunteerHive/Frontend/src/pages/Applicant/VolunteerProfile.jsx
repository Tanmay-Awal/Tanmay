import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';

import {
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  Plus,
  Award,
  Calendar,
  X,
  Lock,
  Trash2,
  Building2,
  Target
} from 'lucide-react';
import './VolunteerProfile.css';
import {
  fetchProfile,
  profileSelectors,
  submitBasicProfile,
  profileActions,
  submitProfileDetails
} from '../../store/Applicant/profileSlice';

const VolunteerProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(profileSelectors.getProfileForm);
  const email = localStorage.getItem('user_email');

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState('');

  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkills, setNewSkills] = useState(profile.skills || []);

  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
  const [experienceDraft, setExperienceDraft] = useState({
    post: '',
    organization: '',
    timeRange: '',
    description: ''
  });

  const skillOptions = [
  { value: 'Teaching', label: 'Teaching' },
  { value: 'Fundraising', label: 'Fundraising' },
  { value: 'Event Planning', label: 'Event Planning' },
  { value: 'Community Outreach', label: 'Community Outreach' },
  { value: 'Environmental', label: 'Environmental' },
  { value: 'Animal Care', label: 'Animal Care' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Tutoring', label: 'Tutoring' },
  { value: 'Mentoring', label: 'Mentoring' },
  { value: 'Public Speaking', label: 'Public Speaking' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'Writing', label: 'Writing' },
  { value: 'Photography', label: 'Photography' },
];



  useEffect(() => {
    if (email) {
      dispatch(fetchProfile());
    }
  }, [dispatch, email]);

  const hasBio = profile.bio && profile.bio.trim() !== '';
  const hasSkills = profile.skills && profile.skills.length > 0;
  const hasExperience = profile.pastExperience && profile.pastExperience.length > 0;

  const handleSaveName = () => {
  if (!newName.trim()) return;

  dispatch(submitBasicProfile({name: newName }))
    .then(() => {
      // ✅ Instantly update local Redux profile
      dispatch(profileActions.updateProfileField({ field: 'name', value: newName }));

      // ✅ Clear local input
      setNewName('');

      // ✅ Switch back to non-edit view
      setIsEditingName(false);
    })
    .catch((err) => console.error(err));
};




  const handleSavePhone = () => {
  if (!newPhone.trim()) return;

  const phoneRegex = /^\+?\d{7,15}$/;
  if (!phoneRegex.test(newPhone)) {
    alert('Please enter a valid phone number (7–15 digits)');
    return;
  }


  dispatch(submitBasicProfile({ 
    name: profile.name,
    phone: newPhone,
    address: profile.address 
  })).then(() => {
    setIsEditingPhone(false);
    dispatch(fetchProfile());
  });
};


  const handleSaveAddress = () => {
  if (!newAddress.trim()) return;
  dispatch(submitBasicProfile({
    name: profile.name,
    phone: profile.phone,
    address: newAddress
  })).then(() => {
    setIsEditingAddress(false);
    dispatch(fetchProfile(email));
  });
};

  const handleSaveBio = () => {
  if (!newBio.trim()) return;

  dispatch(submitProfileDetails({
    skills: profile.skills,
    bio: newBio,
    experience: profile.experience
  })).then(() => {
    dispatch(profileActions.updateProfileField({ field: 'bio', value: newBio }));
    setIsEditingBio(false);
  });
};

const handleSaveSkills = () => {
  dispatch(submitProfileDetails({
    skills: newSkills.map(s => s.value),
    bio: profile.bio,
    experience: profile.experience
  })).then(() => {
    dispatch(profileActions.updateProfileField({ field: 'skills', value: newSkills.map(s => s.value) }));
    setIsEditingSkills(false);
  });
};

const handleSaveExperience = () => {
    const updatedExperiences = [...(profile.pastExperience || [])];
    if (editingExperienceIndex !== null) {
      updatedExperiences[editingExperienceIndex] = experienceDraft;
    } else {
      updatedExperiences.push(experienceDraft);
    }
    dispatch(submitProfileDetails({
      skills: profile.skills,
      bio: profile.bio,
      pastExperience: updatedExperiences
    })).then(() => {
      dispatch(profileActions.updateProfileField({ field: 'pastExperience', value: updatedExperiences }));
      setIsAddingExperience(false);
      setEditingExperienceIndex(null);
      setExperienceDraft({ post: '', organization: '', timeRange: '', description: '' });
    });
  };

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: '40px',
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,   // ⬅️ stays on top of your card
    maxHeight: '250px',
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '250px',
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,   // ⬅️ make sure it floats above everything
  }),
};




  return (
    <>
      <div className="profile-page">
        <div className="profile-header">
          <div className="header-content">
            <h1>My Profile</h1>
            <p>Manage your volunteer profile and showcase your impact</p>
          </div>
        </div>

        <div className="profile-container">

          <div className="profile-card">

            {isEditingName && (
              <div className="name-input-container">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
            )}

            {!profile.name && !isEditingName && (
              <button
                className="add-btn add-name-btn"
                onClick={() => setIsEditingName(true)}
              >
                <Plus size={16} /> Add Name
              </button>
            )}

            {profile.name && !isEditingName && (
              <button
                className="edit-name-btn"
                onClick={() => {
                  setNewName(profile.name);
                  setIsEditingName(true);
                }}
              >
                <Edit3 size={16} /> Edit
              </button>
            )}

            <div className="profile-basic-info">
              {!isEditingName && (
                <h2 className="profile-name">{profile.name || 'N/A'}</h2>
              )}
              <div className="ngo-stats">
                <div className="stat-item">
                  <Building2 className="stat-icon" />
                  <span>Volunteer Profile</span>
                </div>
                <div className="stat-item">
                  <Target className="stat-icon" />
                  <span>Making Impact</span>
                </div>
              </div>
            </div>

            {isEditingName && (
              <button className="save-btn save-name-btn" onClick={handleSaveName}>
                <Save size={16} /> Save
              </button>
            )}
          </div>


          <div className="profile-section">
            <div className="section-header">
              <h3>Contact Information</h3>
            </div>
            <div className="section-content">
              <div className="info-grid">


                <div className="info-item">
                  <Mail className="info-icon" />
                  <div className="info-content">
                    <label>Email Address</label>
                    <span>{profile.email || 'N/A'}</span>
                  </div>
                </div>


                <div className="info-item">
                  <Phone className="info-icon" />
                  <div className="info-content">
                    <label>Phone Number</label>
                    {!isEditingPhone ? (
                      <span>{profile.phone || 'N/A'}</span>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter phone"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                      />
                    )}

                    {!profile.phone && !isEditingPhone && (
                      <button
                        className="edit-btn"
                        onClick={() => setIsEditingPhone(true)}
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}

                    {profile.phone && !isEditingPhone && (
                      <button
                        className="edit-btn edit-phone-btn"
                        onClick={() => {
                          setNewPhone(profile.phone);
                          setIsEditingPhone(true);
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}

                    {isEditingPhone && (
                      <button
                        className="save-btn save-phone-btn"
                        onClick={handleSavePhone}
                      >
                        <Save size={14} /> Save
                      </button>
                    )}
                  </div>
                </div>


                <div className="info-item">
                  <MapPin className="info-icon" />
                  <div className="info-content">
                    <label>Address</label>
                    {!isEditingAddress ? (
                      <span>{profile.address || 'N/A'}</span>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter address"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                      />
                    )}

                    {!profile.address && !isEditingAddress && (
                      <button
                        className="edit-btn"
                        onClick={() => setIsEditingAddress(true)}
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}

                    {profile.address && !isEditingAddress && (
                      <button
                        className="edit-btn edit-address-btn"
                        onClick={() => {
                          setNewAddress(profile.address);
                          setIsEditingAddress(true);
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}

                    {isEditingAddress && (
                      <button
                        className="save-btn save-address-btn"
                        onClick={handleSaveAddress}
                      >
                        <Save size={14} /> Save
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>


<div className="profile-section">
  <div className="section-header">
    <h3>About Me</h3>
    {profile.bio && !isEditingBio ? (
      <button
        className="edit-btn"
        onClick={() => {
          setNewBio(profile.bio);
          setIsEditingBio(true);
        }}
      >
        <Edit3 size={16} /> Edit
      </button>
    ) : !isEditingBio ? (
      <button
        className="edit-btn"
        onClick={() => setIsEditingBio(true)}
      >
        <Plus size={16} /> Add
      </button>
    ) : null}
  </div>

  <div className="section-content bio-section-content">
    {!isEditingBio ? (
      <div className="bio-content">
        <p>{profile.bio || 'N/A'}</p>
      </div>
    ) : (
      <div className="bio-input-container">
        <textarea
          placeholder="Write something about yourself..."
          value={newBio}
          onChange={(e) => setNewBio(e.target.value)}
        />
        <button
          className="save-btn save-bio-btn"
          onClick={handleSaveBio}
        >
          <Save size={16} /> Save
        </button>
      </div>
    )}
  </div>
</div>


<div className="profile-section">
  <div className="section-header">
    <h3>Skills & Interests</h3>
    {hasSkills && !isEditingSkills ? (
      <button
        className="edit-btn"
        onClick={() => {
          setNewSkills(profile.skills.map(s => ({ value: s, label: s })));
          setIsEditingSkills(true);
        }}
      >
        <Edit3 size={16} /> Edit
      </button>
    ) : !isEditingSkills ? (
      <button
        className="edit-btn"
        onClick={() => setIsEditingSkills(true)}
      >
        <Plus size={16} /> Add
      </button>
    ) : null}
  </div>
  <div className="section-content">
    {!isEditingSkills ? (
      <div className="skills-container">
        {hasSkills ? (
          profile.skills.map((skill, index) => (
            <div key={index} className="skill-tag">
              <span>{skill}</span>
            </div>
          ))
        ) : (
          <p>You have no skills and interests yet.</p>
        )}
      </div>
    ) : (
      <div className="skills-input-container">
        <CreatableSelect
      isMulti
  options={skillOptions}
  value={newSkills}
  onChange={setNewSkills}
  placeholder="Select or create skills..."
  styles={customSelectStyles}
  menuPortalTarget={document.body} 
  menuPosition="fixed"             
/>

        <button
          className="save-btn save-skills-btn"
          onClick={handleSaveSkills}
        >
          <Save size={16} /> Save
        </button>
      </div>
    )}
  </div>
</div>



<div className="profile-section">
  <div className="section-header">
    <h3>Volunteer Experience</h3>
  </div>
  <div className="section-content">
    {hasExperience ? (
      profile.pastExperience.map((exp, idx) => (
        <div key={idx} className="experience-item">
          {editingExperienceIndex === idx ? (
            <div>
              <div className="experience-inputs-row">
                <input
                  type="text"
                  placeholder="Post or Duty"
                  value={experienceDraft.post}
                  onChange={(e) =>
                    setExperienceDraft({ ...experienceDraft, post: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Organization"
                  value={experienceDraft.organization}
                  onChange={(e) =>
                    setExperienceDraft({ ...experienceDraft, organization: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Time Range"
                  value={experienceDraft.timeRange}
                  onChange={(e) =>
                    setExperienceDraft({ ...experienceDraft, timeRange: e.target.value })
                  }
                />
              </div>
              <div className="experience-description">
                <textarea
                  placeholder="Description"
                  value={experienceDraft.description}
                  onChange={(e) =>
                    setExperienceDraft({ ...experienceDraft, description: e.target.value })
                  }
                />
              </div>
              <button className="save-btn" onClick={handleSaveExperience}>
                <Save size={16} /> Save
              </button>
            </div>
          ) : (
            <div className="experience-display">
              <div className="experience-actions">
                <Edit3
                  size={16}
                  className="edit-icon"
                  onClick={() => {
                    setEditingExperienceIndex(idx);
                    setExperienceDraft(exp);
                  }}
                />
                <Trash2
                  size={16}
                  className="delete-icon"
                  onClick={() => {
                    const updated = [...profile.pastExperience];
                    updated.splice(idx, 1);
                    dispatch(submitProfileDetails({
                      email,
                      skills: profile.skills,
                      bio: profile.bio,
                      pastExperience: updated
                    })).then(() => {
                      dispatch(profileActions.updateProfileField({ field: 'pastExperience', value: updated }));
                    });
                  }}
                />
              </div>
              <h4>{exp.post}</h4>
              <p>{exp.organization}</p>
              <p>{exp.timeRange}</p>
              <p>{exp.description}</p>
            </div>
          )}
        </div>
      ))
    ) : (
      <p className='abc'>You have no past experience yet.</p>
    )}

    {isAddingExperience && (
      <div className="experience-item">
        <div className="experience-inputs-row">
          <input
            type="text"
            placeholder="Post or Duty"
            value={experienceDraft.post}
            onChange={(e) =>
              setExperienceDraft({ ...experienceDraft, post: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Organization"
            value={experienceDraft.organization}
            onChange={(e) =>
              setExperienceDraft({ ...experienceDraft, organization: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Time Range"
            value={experienceDraft.timeRange}
            onChange={(e) =>
              setExperienceDraft({ ...experienceDraft, timeRange: e.target.value })
            }
          />
        </div>
        <div className="experience-description">
          <textarea
            placeholder="Description"
            value={experienceDraft.description}
            onChange={(e) =>
              setExperienceDraft({ ...experienceDraft, description: e.target.value })
            }
          />
        </div>
        <button className="save-btn" onClick={handleSaveExperience}>
          <Save size={16} /> Save
        </button>
      </div>
    )}

    {!isAddingExperience && editingExperienceIndex === null && (
      <button
        className="add-experience-btn"
        onClick={() => {
          setIsAddingExperience(true);
          setExperienceDraft({
            post: '',
            organization: '',
            timeRange: '',
            description: ''
          });
        }}
      >
        <Plus size={16} /> Add Experience
      </button>
    )}
  </div>
</div>
        </div>
      </div>
    </>
  );
};

export default VolunteerProfile;
