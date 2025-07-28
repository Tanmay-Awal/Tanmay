import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TasksPage.css';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [viewMode, setViewMode] = useState('list'); 
  const navigate = useNavigate();
  
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: '',
    category: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://tanmay-production.up.railway.app/api/tasks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      } else {
        console.error('Failed to fetch tasks');
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId) => {
    try {
      const taskToToggle = tasks.find(task => task.id === taskId);
      if (!taskToToggle) return;
      
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, done: !task.done } : task
      );
      
      setTasks(updatedTasks);
      
      const response = await fetch(`https://tanmay-production.up.railway.app/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          done: !taskToToggle.done,
          title: taskToToggle.title,
          description: taskToToggle.description,
          deadline: taskToToggle.deadline,
          priority: taskToToggle.priority,
          category: taskToToggle.category
        }),
      });

      if (!response.ok) {
        console.error('Failed to update task status on server');
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      fetchTasks();
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`https://tanmay-production.up.railway.app/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditFormData({
      title: task.title,
      description: task.description || '',
      deadline: new Date(task.deadline).toISOString().split('T')[0], 
      priority: task.priority,
      category: task.category || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditFormData({
      title: '',
      description: '',
      deadline: '',
      priority: '',
      category: '',
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSaveEdit = async (taskId) => {
    try {
      const originalTask = tasks.find(task => task.id === taskId);
      if (!originalTask) return;
      
      const updatedTaskData = {
        ...originalTask,
        ...editFormData,
        deadline: new Date(editFormData.deadline)
      };
      
      const response = await fetch(`https://tanmay-production.up.railway.app/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTaskData),
      });

      if (response.ok) {
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? updatedTaskData : task
        );
        setTasks(updatedTasks);
        setEditingTaskId(null); 
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const completionPercentage = tasks.length
    ? Math.floor((tasks.filter((task) => task.done).length / tasks.length) * 100)
    : 0;

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'completed') return task.done;
    if (filterStatus === 'active') return !task.done;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (sortBy === 'priority') {
      const priorityMap = { High: 1, Medium: 2, Low: 3 };
      return priorityMap[a.priority] - priorityMap[b.priority];
    }
    if (sortBy === 'name') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const tasksByStatus = {
    'To Do': sortedTasks.filter((task) => !task.done),
    Completed: sortedTasks.filter((task) => task.done),
  };

  const renderEditForm = (task) => (
    <div className="task-edit-form">
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={editFormData.title}
          onChange={handleEditFormChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Description:</label>
        <textarea
          name="description"
          value={editFormData.description}
          onChange={handleEditFormChange}
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Deadline:</label>
          <input
            type="date"
            name="deadline"
            value={editFormData.deadline}
            onChange={handleEditFormChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Priority:</label>
          <select
            name="priority"
            value={editFormData.priority}
            onChange={handleEditFormChange}
            required
          >
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label>Category:</label>
        <input
          type="text"
          name="category"
          value={editFormData.category}
          onChange={handleEditFormChange}
        />
      </div>
      
      <div className="form-actions">
        <button 
          type="button" 
          className="save-button"
          onClick={() => handleSaveEdit(task.id)}
        >
          Save
        </button>
        <button 
          type="button" 
          className="cancel-button"
          onClick={handleCancelEdit}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="tasks-container">
      <nav className="navbar">
        <div className="logo">
          <Link to="/Home">TaskSteroids</Link>
        </div>
        <div className="nav-links">
          <Link to="/Home">Home</Link>
          <Link to="/TasksPage" className="active">
            Tasks
          </Link>
          <Link to="/ProfilePage">Profile</Link>
          <Link to="/Login">Logout</Link>
        </div>
      </nav>

      <header className="tasks-header">
        <h1>Your Tasks</h1>
        <Link to="/AddTaskPage" className="add-task-button">
          Add New Task +
        </Link>
      </header>

      <div className="task-controls">
        <div className="filter-controls">
          <label>Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="sort-controls">
          <label>Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="deadline">Deadline</option>
            <option value="priority">Priority</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="view-controls">
          <button
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
          <button
            className={`view-button ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewMode('kanban')}
          >
            Kanban View
          </button>
        </div>
      </div>

      <div className="tasks-content">
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            {viewMode === 'list' ? (
              <div className="task-list">
                {sortedTasks.length > 0 ? (
                  sortedTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`task-card ${task.done ? 'completed' : ''}`}
                    >
                      {editingTaskId === task.id ? (
                        renderEditForm(task)
                      ) : (
                        <>
                          <div className="task-header">
                            <div
                              className={`task-checkbox ${task.done ? 'checked' : ''}`}
                              onClick={() => toggleTaskStatus(task.id)}
                            >
                              {task.done ? '✅' : '⬜'}
                            </div>
                            <h3 className="task-title">{task.title}</h3>
                            <div className={`task-priority ${task.priority.toLowerCase()}`}>
                              {task.priority}
                            </div>
                          </div>

                          <div className="task-details">
                            {task.description && (
                              <p className="task-description">{task.description}</p>
                            )}

                            <div className="task-meta">
                              <div className="task-deadline">
                                <span className="label">Deadline:</span>
                                <span>{new Date(task.deadline).toLocaleDateString()}</span>
                              </div>

                              {task.category && (
                                <div className="task-category">
                                  <span className="label">Category:</span>
                                  <span>{task.category}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="task-actions">
                            <button
                              className="edit-button"
                              onClick={() => handleEditClick(task)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => deleteTask(task.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-tasks-message">
                    <p>No tasks found.</p>
                    <p>Get started by adding your first task!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="kanban-board">
                {Object.keys(tasksByStatus).map((status) => (
                  <div key={status} className="kanban-column">
                    <h3 className="kanban-column-header">{status}</h3>
                    <div className="kanban-cards">
                      {tasksByStatus[status].length > 0 ? (
                        tasksByStatus[status].map((task) => (
                          <div key={task.id} className="kanban-card">
                            {editingTaskId === task.id ? (
                              <div className="kanban-edit-container">
                                {renderEditForm(task)}
                              </div>
                            ) : (
                              <>
                                <div className="kanban-card-header">
                                  <h4>{task.title}</h4>
                                  <div className={`task-priority ${task.priority.toLowerCase()}`}>
                                    {task.priority}
                                  </div>
                                </div>

                                {task.description && (
                                  <p className="kanban-card-description">{task.description}</p>
                                )}

                                <div className="kanban-card-footer">
                                  <div className="kanban-card-deadline">
                                    {new Date(task.deadline).toLocaleDateString()}
                                  </div>
                                  <div className="kanban-card-actions">
                                    <button
                                      className="status-toggle"
                                      onClick={() => toggleTaskStatus(task.id)}
                                    >
                                      {status === 'To Do' ? 'Complete' : 'Reopen'}
                                    </button>
                                    <div className="action-buttons">
                                      <button
                                        className="edit-icon"
                                        onClick={() => handleEditClick(task)}
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        className="delete-icon"
                                        onClick={() => deleteTask(task.id)}
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="empty-column-message">
                          No tasks in this column
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <footer className="tasks-stats">
        <div className="stat-item">
          <span className="stat-label">Total Tasks:</span>
          <span className="stat-value">{tasks.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{tasks.filter((task) => task.done).length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Remaining:</span>
          <span className="stat-value">{tasks.filter((task) => !task.done).length}</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${completionPercentage}%`,
              }}
            ></div>
          </div>
          <div className="progress-text">{completionPercentage}% completed</div>
        </div>
      </footer>
    </div>
  );
};

export default TasksPage;
