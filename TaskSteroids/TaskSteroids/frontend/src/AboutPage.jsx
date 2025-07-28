import React from 'react';
import { Rocket, Zap, Target, Award, Star } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

const AboutPage = () => {
    const Navigate = useNavigate();
    const handleclick = () => {
        Navigate("/TasksPage");
    };
  return (
    <div className="about-container" style={{ 
      backgroundColor: '#000', 
      color: '#fff', 
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '3rem'
      }}>
        <div className="logo" style={{ color: '#30D5F7', fontSize: '1.5rem', fontWeight: 'bold' }}>
          TaskSteroids
        </div>
        <div className="nav-links">
          <a href="/Home" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>Home</a>
          <a href="/TasksPage" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>Tasks</a>
          <a href="/ProfilePage" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>Profile</a>
          <a href="/login" style={{ color: '#fff', textDecoration: 'none' }}>Logout</a>
        </div>
      </nav>

      <div className="hero-section" style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '4rem'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ color: '#30D5F7' }}>About </span>
          <span style={{ marginLeft: '0.5rem' }}>TaskSteroids</span>
          <Star style={{ marginLeft: '1rem', color: '#30D5F7' }} />
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#aaa', maxWidth: '800px' }}>
          Discover the story behind the productivity platform that's changing how people manage their tasks and supercharge their efficiency.
        </p>
      </div>

      <div className="about-content" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="about-text" style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ color: '#30D5F7', marginBottom: '1.5rem', fontSize: '2rem' }}>Our Mission</h2>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6', color: '#ddd' }}>
            TaskSteroids was born from a simple observation: traditional to-do lists weren't cutting it in today's fast-paced world. We needed something more powerful—a tool that could truly supercharge productivity.
          </p>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6', color: '#ddd' }}>
            Our mission is to help people achieve more by creating a task management system that's both powerful and simple to use. We believe that the right tool can transform your productivity and help you reach new heights.
          </p>
          <p style={{ marginBottom: '2rem', lineHeight: '1.6', color: '#ddd' }}>
            Founded in 2023, TaskSteroids has already helped thousands of users transform their workflow and accomplish more than they thought possible—one task at a time.
          </p>

          <h2 style={{ color: '#30D5F7', marginBottom: '1.5rem', fontSize: '2rem' }}>The Team</h2>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6', color: '#ddd' }}>
            We're a small but dedicated team of productivity enthusiasts, developers, and designers who are passionate about creating tools that make a difference. Each feature in TaskSteroids is crafted with attention to detail and a deep understanding of workflow optimization.
          </p>
        </div>

        <div className="features" style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ color: '#30D5F7', marginBottom: '1.5rem', fontSize: '2rem' }}>Why Choose TaskSteroids?</h2>
          
          <div className="feature-item" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ 
              backgroundColor: 'rgba(48, 213, 247, 0.1)', 
              padding: '0.75rem',
              borderRadius: '50%',
              marginRight: '1rem'
            }}>
              <Rocket size={24} color="#30D5F7" />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Supercharged Performance</h3>
              <p style={{ color: '#aaa' }}>TaskSteroids is built for speed and efficiency, helping you blast through your to-do list faster than ever.</p>
            </div>
          </div>

          <div className="feature-item" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ 
              backgroundColor: 'rgba(48, 213, 247, 0.1)', 
              padding: '0.75rem',
              borderRadius: '50%',
              marginRight: '1rem'
            }}>
              <Zap size={24} color="#30D5F7" />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Intuitive Interface</h3>
              <p style={{ color: '#aaa' }}>Our clean, distraction-free design helps you focus on what matters most: completing your tasks.</p>
            </div>
          </div>

          <div className="feature-item" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ 
              backgroundColor: 'rgba(48, 213, 247, 0.1)', 
              padding: '0.75rem',
              borderRadius: '50%',
              marginRight: '1rem'
            }}>
              <Target size={24} color="#30D5F7" />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Goal-Oriented Approach</h3>
              <p style={{ color: '#aaa' }}>Set clear objectives and watch as TaskSteroids helps you achieve them one by one.</p>
            </div>
          </div>

          <div className="feature-item" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ 
              backgroundColor: 'rgba(48, 213, 247, 0.1)', 
              padding: '0.75rem',
              borderRadius: '50%',
              marginRight: '1rem'
            }}>
              <Award size={24} color="#30D5F7" />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Proven Results</h3>
              <p style={{ color: '#aaa' }}>Users report an average 40% increase in task completion after switching to TaskSteroids.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section" style={{ 
        marginTop: '4rem',
        textAlign: 'center',
        padding: '3rem 2rem',
        borderRadius: '8px',
        background: 'linear-gradient(to right, rgba(48, 213, 247, 0.1), rgba(0, 0, 0, 0))'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>Ready to boost your efficiency to new heights?</h2>
        <p style={{ marginBottom: '2rem', color: '#aaa', maxWidth: '800px', margin: '0 auto' }}>
          Join thousands of users who have transformed their productivity with TaskSteroids.
        </p>
        <button style={{ 
          backgroundColor: '#30D5F7',
          color: '#000',
          border: 'none',
          padding: '0.75rem 2rem',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop:'203px'
        }} onClick={handleclick}>
          Start Managing Tasks
        </button>
      </div>

      <footer style={{ 
        marginTop: '5rem',
        paddingTop: '2rem',
        borderTop: '1px solid #333',
        textAlign: 'center',
        color: '#777'
      }}>
        <p>© {new Date().getFullYear()} TaskSteroids. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
