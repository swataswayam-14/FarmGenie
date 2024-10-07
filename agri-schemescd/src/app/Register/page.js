"use client";
import React, { useState } from 'react';
import './register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    additionalInfo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you might want to add more validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Registration successful');
        // Redirect or clear form etc.
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <div className="registerLogoImage" />
          <h3 className="registerLogo typing">FarmGenie</h3>
          <span className="registerDesc">
            Your one-stop solution for all farming needs. Connect, learn, and grow with a community that supports you every step of the way.
          </span>
        </div>
        <div className="registerRight">
          <form className="registerBox" onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Name"
              type="text"
              required
              className="registerInput"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="age"
              placeholder="Age"
              type="number"
              required
              className="registerInput"
              value={formData.age}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Phone Number"
              type="tel"
              required
              className="registerInput"
              pattern="[0-9]{10}"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email"
              type="email"
              required
              className="registerInput"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="password"
              placeholder="Password"
              className="registerInput"
              required
              minLength="6"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              name="confirmPassword"
              placeholder="Confirm Password"
              className="registerInput"
              required
              minLength="6"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <textarea
              name="additionalInfo"
              placeholder="Additional Information (e.g., Land Area, Crop Type)"
              className="registerTextarea"
              rows="3"
              value={formData.additionalInfo}
              onChange={handleChange}
            ></textarea>
            <button className="registerButton" type="submit">
              Register
            </button>
            <span className="registerLogin">
              Already have an account? <a href="/login" className="registerLoginLink">Login</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}

