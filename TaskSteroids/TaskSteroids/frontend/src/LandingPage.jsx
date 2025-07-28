import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css"; 

const LandingPage = () => {
  return (
    <div className="landing-container">
      <nav className="navbar">

        <h2 className="app-title">TaskSteroids</h2>
      </nav>

      <main className="main-content">
      <h2 className="typing-quote">
  "Supercharge your productivity. One task at a time. Get Started"
</h2>
        <div className="button-group">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/Register" className="btn">Register</Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
