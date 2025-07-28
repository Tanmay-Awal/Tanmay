import React from 'react';
import { Search, Filter, Calendar, MapPin, User, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getNgoTasks } from "../../store/NGO/Ngo_tasksSlice";
import { useNavigate } from 'react-router-dom';
import { deleteNgoTask } from "../../store/NGO/Ngo_tasksSlice";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './VolunteerProgressTracker.css';

const VolunteerProgressTracker = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  const entireState = useSelector((state) => state);
  const ngoTasksState = useSelector((state) => state.ngoTasks);
  
  const { tasks: ngoTasks = [], loading, error } = useSelector(
    (state) => state.ngoTasks || {}
  );

  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  useEffect(() => {
    dispatch(getNgoTasks());
  }, [dispatch,location]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Pending', class: 'status-pending' },
      in_progress: { text: 'In Progress', class: 'status-progress' },
      completed: { text: 'Completed', class: 'status-completed' },
      verified: { text: 'Verified', class: 'status-verified' }
    };

    const normalized = status.toLowerCase().replace(' ', '_');
    return statusConfig[normalized] || { text: 'Unknown', class: 'status-unknown' };
  };

  const getStatusIcon = (status) => {
    const normalized = status.toLowerCase().replace(' ', '_');
    switch (normalized) {
      case 'pending': return <Clock className="status-icon" />;
      case 'in_progress': return <AlertCircle className="status-icon" />;
      case 'completed': return <CheckCircle className="status-icon" />;
      case 'verified': return <CheckCircle className="status-icon" />;
      default: return <Clock className="status-icon" />;
    }
  };

  if (loading) return <div><p>Loading tasks...</p></div>;
  if (error) return <div><p>Error: {error}</p></div>;

  return (
    <div className="progress-tracker-container">
      <div className="progress-header">
        <div className="header-content">
          <h1 className="page-title">Volunteer Progress Tracking</h1>
          <p className="page-subtitle">Monitor and manage volunteer task progress</p>
        </div>

        <div className="header-controls">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search opportunities..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-container">
            <Filter className="filter-icon" />
            <select 
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </div>
      </div>

      {ngoTasks
        .filter(task => {
          if (!selectedStatus) return true;
          const normalized = task.status.toLowerCase().replace(' ', '_');
          return normalized === selectedStatus;
        })
        .filter(task => {
          if (!searchQuery) return true;
          const query = searchQuery.toLowerCase();
          return (
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query)
          );
        })
        .length === 0 && (
          <div className="no-volunteers-message" style={{textAlign: 'center', margin: '2rem 0', color: '#888'}}>No volunteers to track.</div>
      )}

      <div className="progress-grid">
        {ngoTasks
          .filter(task => {
            if (!selectedStatus) return true;
            const normalized = task.status.toLowerCase().replace(' ', '_');
            return normalized === selectedStatus;
          })
          .filter(task => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
              task.title.toLowerCase().includes(query) ||
              task.description.toLowerCase().includes(query)
            );
          })
          .map(task => {
            const statusInfo = getStatusBadge(task.status);
            return (
              <div key={task.id} className="progress-card">
                <div className="card-image-container">
                  <img src={`http://localhost:5000/uploads/${task.image}`} alt={task.title} className="card-image" />
                </div>

                <div className="card-content">
                  <h3 className="card-title">{task.title}</h3>
                  <p className="card-description">{task.description}</p>

                  <div className="card-details">
                    <div className="detail-item">
                      <Calendar className="detail-icon" />
                      <span className="detail-text">
                        {task.startDate ? new Date(task.startDate).toLocaleDateString() : "N/A"}
                      </span>
                    </div>

                    <div className="detail-item">
                      <MapPin className="detail-icon" />
                      <span className="detail-text">{task.location}</span>
                    </div>

                    <div className="detail-item">
                      <User className="detail-icon" />
                      <span className="detail-text">{task.volunteerName}</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    {task.status.toLowerCase() === 'completed' ? (
                      <Link
                        className="verify-btn"
                        to={`/ngo-verify-task/${task.id}`}
                      >
                      <Eye className="btn-icon" />
                      Verify Task
                    </Link>
                    ) : (
                      <button className={`status-btn ${statusInfo.class}`} disabled>
                        {getStatusIcon(task.status)}
                        <span>{statusInfo.text}</span>
                      </button>
                  )}

                  {(task.verified === 'Approved' || task.verified === 'Rejected') && (
                  <div className={`verified-outcome ${task.verified.toLowerCase()}`}>
                    Outcome: {task.verified}
                  </div>
                  )}
                  {(task.verified === 'Approved' || task.verified === 'Rejected') && (
                  <button
                    className="delete-btn"
                    onClick={() => {
                      dispatch(deleteNgoTask(task.id));
                    }}
                  >
                  🗑️ Delete
                  </button>
                  )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default VolunteerProgressTracker;