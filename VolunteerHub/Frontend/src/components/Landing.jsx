import React from 'react'
import { Link } from "react-router-dom";
import "./Landing.css"; 
import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [isVisible, setIsVisible] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.3 }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

    const navigate = useNavigate();

    const navilogin = () => {
        navigate('/Login');
    }
    const navisignup = () => {
        navigate('/Signup');
    }

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>VolunteerHub</h2>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>

            <button className="nav-btn login-btn" onClick={navilogin} >Login</button>
            <button className="nav-btn signup-btn" onClick={navisignup}>Create An Account</button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Empower Your NGO with Smart Volunteer Management</h1>
          <p>Streamline volunteer coordination, track impact, and build stronger communities with our comprehensive management platform.</p>
        </div>
      </section>

      <section className="banner light-banner">
        <div className="banner-content">
          <h3>Join 500+ NGOs already making a difference</h3>
          <p>Trusted by organizations worldwide to manage volunteers effectively</p>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h2>Everything You Need to Manage Volunteers</h2>
          
          <div className={`feature-item scroll-animate ${isVisible['feature1'] ? 'visible' : ''}`} id="feature1">
            <div className="feature-content left">
              <h3>Smart Volunteer Registration</h3>
              <p>Streamline the onboarding process with customizable forms and automated welcome sequences.</p>
            </div>
            <div className="feature-image right diagonal-right">
              <div className="image-placeholder">
                <img src="https://static.vecteezy.com/system/resources/previews/022/992/688/large_2x/group-of-volunteer-people-joining-together-in-money-raising-event-for-donation-in-charity-work-and-ngo-related-activity-such-as-global-warming-environmental-issues-pollution-and-eco-friendly-project-photo.jpg" alt="" />
              </div>
            </div>
          </div>

          <div className={`feature-item scroll-animate ${isVisible['feature2'] ? 'visible' : ''}`} id="feature2">
            <div className="feature-image left diagonal-left">
              <div className="image-placeholder">
                <img src="https://static.vecteezy.com/system/resources/previews/035/404/974/large_2x/team-of-young-and-diversity-volunteer-worker-group-enjoy-charitable-social-work-outdoor-in-tree-forest-planting-ngo-work-for-fighting-climate-change-and-global-warming-in-coastline-habitat-project-photo.jpg" alt="" />
              </div>
            </div>
            <div className="feature-content right">
              <h3>Event & Schedule Management</h3>
              <p>Create events, assign volunteers, and track participation all in one centralized dashboard.</p>
            </div>
          </div>

          <div className={`feature-item scroll-animate ${isVisible['feature3'] ? 'visible' : ''}`} id="feature3">
            <div className="feature-content left">
              <h3>Impact Tracking & Reports</h3>
              <p>Measure your organization's impact with detailed analytics and automated reporting tools.</p>
            </div>
            <div className="feature-image right diagonal-right">
              <div className="image-placeholder">
                <img src="https://media.istockphoto.com/id/1145183123/photo/young-happy-volunteers-outdoor-meeting-at-park.jpg?s=612x612&w=0&k=20&c=2jyEEioGzgvaC59D6E3NSqW0hIDVE9BuTfvYu54EJDA=" alt="" />
              </div>
            </div>
          </div>

          <div className={`feature-item scroll-animate ${isVisible['feature4'] ? 'visible' : ''}`} id="feature4">
            <div className="feature-image left diagonal-left">
              <div className="image-placeholder">
                <img src="https://media.istockphoto.com/id/2155998573/photo/charity-high-five-and-volunteer-team-in-park-with-parcel-for-donation-distribution-or.jpg?s=612x612&w=0&k=20&c=FWrCJWwrzTLHnfMnHiC8dKi4zhmQCrukhRrr90vc340=" alt="" />
              </div>
            </div>
            <div className="feature-content right">
              <h3>Communication Hub</h3>
              <p>Keep volunteers engaged with built-in messaging, notifications, and community features.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <div className="container">
          <div className={`about-content scroll-animate ${isVisible['about'] ? 'visible' : ''}`} id="about">
            <h2>Built for NGOs, by People Who Care</h2>
            <p>We understand the challenges NGOs face in managing volunteers effectively. Our platform is designed to simplify complex processes while maintaining the personal touch that makes volunteer work meaningful.</p>
            <div className="stats">
              <div className="stat">
                <h3>500+</h3>
                <p>NGOs Trust Us</p>
              </div>
              <div className="stat">
                <h3>10,000+</h3>
                <p>Active Volunteers</p>
              </div>
              <div className="stat">
                <h3>50,000+</h3>
                <p>Hours Tracked</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="banner cta-banner">
        <div className="banner-content">
          <h3>Ready to Transform Your Volunteer Management?</h3>
          <p>Start your free trial today and see the difference organized volunteer management makes</p>
          <button className="cta-btn primary" onClick={navisignup}>Get Started Now</button>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>VolunteerHub</h4>
              <p>Empowering NGOs through smart volunteer management</p>
            </div>
            <div className="footer-section">
              <h5>Product</h5>
              <a href="#features">Features</a>
            </div>

            <div className="footer-section">
              <h5>Company</h5>
              <a href="#about">About</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 VolunteerHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;