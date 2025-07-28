import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {


  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    tasksCompleted: 0,
    tasksInProgress: 0,
    streak: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch('https://tanmay-production.up.railway.app/api/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');

      setUserData(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    setFormData({
      username: userData.username,
      email: userData.email,
    });
  }, [userData]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleResetProgress = async () => {
    if (!window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
        return;
    }

    try {
        const response = await fetch("https://tanmay-production.up.railway.app/api/user/reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (response.ok) {
            alert("Progress reset successfully!");
            navigate('/Home');
          
        } else {
            const data = await response.json();
            alert(data.msg || "Failed to reset progress.");
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
};


const handleDeleteAccount = async () => {
  if (!window.confirm("Are you sure you want to delete your account")) {
    return;
}
  try {
      const response = await axios.delete('https://tanmay-production.up.railway.app/api/user/delete', {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });

      if (response && response.status === 200) {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');

          navigate('/register');
      } else {
          alert('Something went wrong while deleting your account.');
      }
  } catch (error) {
      console.error('Error deleting account:', error);
      
      if (error.response) {
          alert(error.response.data.message || 'Failed to delete account.');
      } else if (error.request) {
          alert('No response from server. Please try again later.');
      } else {
          alert('An unexpected error occurred.');
      }
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://tanmay-production.up.railway.app/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');

      setUserData(data);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-container loading">
        <div className="loader"></div>
        <p>Loading profile data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container error">
        <h2>Error loading profile</h2>
        <p>{error}</p>
        <button className="primary-button" onClick={fetchUserData}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <nav className="navbar">
        <div className="logo">
          <Link to="/Home">TaskSteroids</Link>
        </div>
        <div className="nav-links">
          <Link to="/Home">Home</Link>
          <Link to="/TasksPage">Tasks</Link>
          <Link to="/ProfilePage" className="active">Profile</Link>
          <Link to="/login">Logout</Link>
        </div>
      </nav>

      <div className="profile-container">
        <h1 className="page-title">Your Profile</h1>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              {!isEditing && (
                <div className="profile-actions">
                  <button className="edit-button" onClick={handleEditToggle}>
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary-button">Save Changes</button>
                  <button type="button" className="secondary-button" onClick={handleEditToggle}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">Username:</span>
                  <span className="detail-value">{userData.username}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{userData.email}</span>
                </div>
              </div>
            )}
          </div>

          <div className="stats-container">
            <h2 className="section-title">Productivity Stats</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-value">{userData.tasksCompleted}</span>
                <span className="stat-label">Tasks Completed</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{userData.tasksInProgress}</span>
                <span className="stat-label">In Progress</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{userData.streak}</span>
                <span className="stat-label">Day Streak</span>
              </div>
            </div>
          </div>

          <div className="danger-zone">
            <h3>Account Actions</h3>
            <div className="danger-buttons">
              <button className="danger-button" onClick={handleResetProgress}>Reset Progress</button>
              <button className="danger-button" onClick={handleDeleteAccount}>Delete Account</button>
            </div>
            <p className="danger-note">These actions cannot be undone.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
