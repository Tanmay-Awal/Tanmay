import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AddTaskPage.css';

const AddTaskPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    deadline: getTomorrowDate(),
    category: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://tanmay-production.up.railway.app/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
          deadline: formData.deadline,
          category: formData.category.trim(),
          done: false
        })
      });

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          priority: 'Medium',
          deadline: getTomorrowDate(),
          category: ''
        });
        navigate('/TasksPage');
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'Failed to create task' });
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-task-container">
      <nav className="navbar">
        <div className="logo">
          <Link to="/Home">TaskSteroids</Link>
        </div>
        <div className="nav-links">
          <Link to="/Home">Home</Link>
          <Link to="/TasksPage" className="active">Tasks</Link>
          <Link to="/ProfilePage">Profile</Link>
          <Link to="/Login">Logout</Link>
        </div>
      </nav>

      <div className="form-container">
        <div className="form-header">
          <h1>Add New Task</h1>
          <Link to="/TasksPage" className="back-button">← Back to Tasks</Link>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          {errors.submit && (
            <div className="error-message form-error">{errors.submit}</div>
          )}

          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="4"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group half">
              <label htmlFor="deadline">Deadline *</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={errors.deadline ? 'error' : ''}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.deadline && <div className="error-message">{errors.deadline}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter task category (e.g., Work, Personal, Study)"
            />
          </div>

          <div className="form-buttons">
            <Link to="/TasksPage" className="btn secondary">Cancel</Link>
            <button type="submit" className="btn primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskPage;
