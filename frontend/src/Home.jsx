import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [todaysTasks, setTodaysTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodaysTasks();
  }, []);

  const fetchTodaysTasks = async () => {
    try {
      const response = await fetch('https://tanmay-production.up.railway.app/api/tasks/upcoming', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTodaysTasks(data.tasks.slice(0, 3)); 
      } else {
        setTodaysTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTodaysTasks([]);
    }
  };

  const goToTasksPage = (e) => {
    e.preventDefault();
    navigate('/TasksPage');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">
          <Link to="/Home">TaskSteroids</Link>
        </div>
        <div className="nav-links">
          <Link to="/Home" className="active">Home</Link>
          <Link to="/TasksPage">Tasks</Link>
          <Link to="/ProfilePage">Profile</Link>
          <Link to="/login">Logout</Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Supercharge Your Productivity with TaskSteroids 💥</h1>
          <p>One task at a time. Boost your efficiency to new heights.</p>
          <button className="cta-button" onClick={goToTasksPage}>
            Start Managing Tasks
          </button>
        </div>
        <div className="hero-image">
          <div className="productivity-illustration">
            <img src="https://plus.unsplash.com/premium_photo-1682436392452-1493ac3bdf17?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fHByb2R1Y3Rpdml0eXxlbnwwfHwwfHx8MA%3D%3D" alt="Productivity" />
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why TaskSteroids?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">✍️</div>
            <h3>Create and Manage Tasks</h3>
            <p>Easily add, edit, and track your tasks in one place.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🕒</div>
            <h3>Set Deadlines & Reminders</h3>
            <p>Never miss a deadline with our smart reminder system.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧩</div>
            <h3>Categorize and Prioritize</h3>
            <p>Organize tasks by priority and category for better focus.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Track Progress with Analytics</h3>
            <p>Visualize your productivity with detailed analytics.</p>
          </div>
        </div>
      </section>

      <section className="quick-glance-section">
        <h2>Today's Tasks</h2>
        <div className="todays-tasks">
          {todaysTasks.length > 0 ? (
            todaysTasks.map(task => (
              <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
                <div className="task-checkbox">
                  {task.done ? "✅" : "⬜"}
                </div>
                <div className="task-details">
                  <div className="task-info">
                  <span className="task-title">{task.title}</span>
                    <span className={`task-priority ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span className="task-deadline">Due: {formatDate(task.deadline)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-tasks-message">
              <p>You haven't added any tasks yet.</p>
              <p>Start by adding your first task!</p>
            </div>
          )}
        </div>

        {todaysTasks.length > 0 && (
          <div className="progress-container">
            <div className="progress-label">Today's Progress</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(todaysTasks.filter(t => t.done).length / todaysTasks.length) * 100}%` }}>
              </div>
            </div>
            <div className="progress-text">
              {todaysTasks.filter(t => t.done).length} of {todaysTasks.length} completed
            </div>
          </div>
        )}

        <div className="quick-add">
          <Link to="/AddTaskPage" className="add-task-button">
            Add Task +
          </Link>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>What People Are Saying</h2>
        <div className="testimonials-container">
          <div className="testimonial">
            <p>"I finish twice the work in half the time!"</p>
            <div className="testimonial-author">– A Productivity Wizard 🧙‍♂️</div>
          </div>
          <div className="testimonial">
            <p>"TaskSteroids transformed how I organize my day."</p>
            <div className="testimonial-author">– Task Master 🚀</div>
          </div>
          <div className="testimonial">
            <p>"The sleek interface makes task management actually enjoyable."</p>
            <div className="testimonial-author">– Design Enthusiast 🎨</div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">TaskSteroids</div>
          <div className="footer-links">
            <Link to="/AboutPage">About</Link>
            <Link to="https://policies.google.com/privacy?hl=en-US">Privacy Policy</Link>
          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} TaskSteroids. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
