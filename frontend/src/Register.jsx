import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('https://tanmay-production.up.railway.app/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registered successfully!");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-wrapper">
        <div className="register-container">
          <h2 className="register-title">Register</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit">Register</button>
            <p className="login-link" onClick={() => navigate("/login")}>
              Already have an account? Login
            </p>
          </form>
        </div>

        <div className="register-image">
          <img className="icon" src="data:image/png;base64,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" alt="Visual" />
        </div>
      </div>
    </div>
  );
}

export default Register;
