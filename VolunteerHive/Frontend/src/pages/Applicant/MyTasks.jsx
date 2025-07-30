import { useDispatch, useSelector } from 'react-redux';
import { Filter, Calendar, MapPin, Clock, Play, CheckCircle, Eye } from 'lucide-react';
import { fetchTasks, markTaskStarted, markTaskCompleted } from '../../store/Applicant/tasksSlice';
import { softDeleteTask } from '../../store/Applicant/tasksSlice';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import './MyTasks.css';

const MyTasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();


  useEffect(() => {
    const email = localStorage.getItem('user_email');
    console.log("✅ Email for MyTasks:", email);
    if (email) {
      dispatch(fetchTasks(email));
    } else {
      console.error("❌ No email found in localStorage!");
    }
  }, [dispatch]);

  const handleFilterChange = (filterValue) => {
    setActiveFilter(filterValue);
  };


  const handleTaskAction = (taskId, action) => {
    if (action === 'start') {
      dispatch(markTaskStarted(taskId));
    } else if (action === 'complete') {
      dispatch(markTaskCompleted(taskId));
    } else {
      console.log(`No action for: ${action}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-progress';
      case 'Completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'All') return true;
    return task.status === activeFilter;
  });


  const renderActionButton = (task) => {
    if (task.verified === 'Approved' || task.verified === 'Rejected') {
      return null;
    }

    switch (task.status) {
      case 'Pending':
        return (
          <button
            className="action-btn start-btn"
            onClick={() => handleTaskAction(task.id, 'start')}
          >
            <Play size={16} />
            Start Task
          </button>
        );
      case 'In Progress':
        return (
          <button
            className="action-btn complete-btn"
            onClick={() => handleTaskAction(task.id, 'complete')}
          >
            <CheckCircle size={16} />
            Mark Complete
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="tasks-page">
        <div className="page-header">
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Manage your assigned volunteer tasks</p>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <Filter className="filter-icon" size={20} />
            <div className="filter-buttons">
              {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
                <button
                  key={status}
                  className={`filter-btn ${status === activeFilter ? 'active' : ''}`}
                  onClick={() => handleFilterChange(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="tasks-grid">
          {filteredTasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div className={`status-badge ${getStatusColor(task.status)}`}>
                  {task.status}
                </div>
              </div>

              <p className="task-description">{task.description}</p>

              <div className="task-details">
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>Start Date: {task.start_date ? new Date(task.start_date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{task.location || 'N/A'}</span>
                </div>
                {task.duration && (
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>Duration: {task.duration}</span>
                  </div>
                )}
                <div className="detail-item">
                  <CheckCircle size={16} />
                  <span>Verified: {task.verified}</span>
                </div>
              </div>

              <div className="task-actions">
                {renderActionButton(task)}
                <button
                  className="action-btn secondary-btn"
                  onClick={() => navigate(`/task-details/${task.id}`)}
                >
                <Eye size={16} />
                  View Details
                </button>
                {(task.verified === 'Approved' || task.verified === 'Rejected') && (
                  <button
                    className="action-btn delete-btn"
                    onClick={() => dispatch(softDeleteTask(task.id))}
                  >
                  🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <CheckCircle size={48} />
            </div>
            <h3>No tasks found</h3>
            <p>You don't have any tasks assigned yet. Check back later!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MyTasks;
