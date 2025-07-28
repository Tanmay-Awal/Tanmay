import React, { useEffect, useState } from 'react';
import './NgoVerifyTask.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleNgoTask, verifyNgoTask } from '../../store/NGO/Ngo_tasksSlice';
import { clearSingleTask } from '../../store/NGO/Ngo_tasksSlice';


const NgoVerifyTask = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleTask: currentTask, loading, error, verifySuccess } = useSelector((state) => state.ngoTasks);
  const [adminMessage, setAdminMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [impactScore, setImpactScore] = useState('');


  useEffect(() => {
    dispatch(clearSingleTask());
    dispatch(getSingleNgoTask(id));
  }, [dispatch, id]);


  useEffect(() => {
    if (verifySuccess && !loading) {
      console.log("✅ Verification successful, navigating...");
      navigate('/ngo-track');
    }
  }, [verifySuccess, loading, navigate]);

  const handleApprove = async () => {
    if (!adminMessage.trim()) {
      alert('Please enter a message before approving');
      return;
    }
    
    setIsProcessing(true);
    try {
      if (!impactScore || impactScore < 1 || impactScore > 100) {
        alert('Please enter a valid impact score (1-100)');
        setIsProcessing(false);
        return;
      }

      await dispatch(verifyNgoTask({ id, action: 'approve', message: adminMessage, impactScore: Number(impactScore)  })).unwrap();

    } catch (error) {
      console.error('Error approving task:', error);
      alert('Error approving task. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!adminMessage.trim()) {
      alert('Please enter a message before rejecting');
      return;
    }
    
    setIsProcessing(true);
    try {
      await dispatch(verifyNgoTask({ id, action: 'reject', message: adminMessage })).unwrap();
    } catch (error) {
      console.error('Error rejecting task:', error);
      alert('Error rejecting task. Please try again.');
      setIsProcessing(false);
    }
  };

  if (loading) return <p>Loading task...</p>;
  if (error) return <p>{error}</p>;
  if (!currentTask) return <p>No task found.</p>;

  return (
    <div className="verify-task-container">
      <div className="verify-task-wrapper">
        <div className="page-header">
          <h1 className="page-title">Verify Task</h1>
          <p className="page-subtitle">Review and verify volunteer task completion</p>
        </div>

        <div className="task-content">
          <div className="task-main-section">
            <div className="task-header-card">
              <div className="task-status-badge">
                <span className={`status-indicator ${currentTask?.status?.toLowerCase()}`}></span>
                <span className="status-text">{currentTask?.status}</span>
              </div>
              <h2 className="task-title">{currentTask?.title}</h2>
            </div>

            <div className="task-info-section">
              <h3 className="section-title">Task Information</h3>
              <div className="task-description">
                <div className="info-item">
                  <label>Description:</label>
                  <p>{currentTask?.description}</p>
                </div>
              </div>
              <div className="task-details-horizontal">
                <div className="info-item">
                  <label>Location:</label>
                  <p>{currentTask?.location}</p>
                </div>
                <div className="info-item">
                  <label>Date:</label>
                  <p>
                    {currentTask?.startDate
                      ? new Date(currentTask.startDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="volunteer-info-section">
              <h3 className="section-title">Volunteer Information</h3>
              <div className="volunteer-details">
                <div className="volunteer-avatar">
                  <span className="avatar-text">
                    {currentTask?.volunteer?.name?.charAt(0) || ''}
                  </span>
                </div>
                <div className="volunteer-info">
                  <div className="info-item">
                    <label>Name:</label>
                    <p>{currentTask?.volunteer?.name}</p>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <p>{currentTask?.volunteer?.email}</p>
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    <p>{currentTask?.volunteer?.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="verification-sidebar">
            <div className="verification-card">
              <h3 className="verification-title">Verification Actions</h3>

              <div className="verification-form">
  <div className="form-group">
    <label htmlFor="impactScore">Impact Score (1-100):</label>
    <input
      type="number"
      id="impactScore"
      className="impact-score-input"
      placeholder="Enter impact score"
      min="1"
      max="100"
      value={impactScore}
      onChange={(e) => setImpactScore(e.target.value)}
      disabled={isProcessing}
    />
  </div>

  <div className="form-group">
    <label htmlFor="adminMessage">Admin Message:</label>
    <textarea
      id="adminMessage"
      className="admin-message-input"
      placeholder="Write your feedback or comments for the volunteer..."
      rows="4"
      value={adminMessage}
      onChange={(e) => setAdminMessage(e.target.value)}
      disabled={isProcessing}
    />
  </div>

  <div className="action-buttons">
    <button 
      className="approve-btn" 
      onClick={handleApprove}
      disabled={isProcessing || !adminMessage.trim()}
    >
      <span className="btn-icon">✓</span>
      {isProcessing ? 'Processing...' : 'Approve Task'}
    </button>
    <button 
      className="reject-btn" 
      onClick={handleReject}
      disabled={isProcessing || !adminMessage.trim()}
    >
      <span className="btn-icon">✕</span>
      {isProcessing ? 'Processing...' : 'Reject Task'}
    </button>
  </div>
</div>

<div className="verification-guidelines">
  <h4>Verification Guidelines:</h4>
  <ul>
    <li>Check if the task was completed as described</li>
    <li>Verify the proof image shows actual completion</li>
    <li>Ensure the volunteer followed safety protocols</li>
    <li>Provide constructive feedback</li>
  </ul>
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgoVerifyTask;