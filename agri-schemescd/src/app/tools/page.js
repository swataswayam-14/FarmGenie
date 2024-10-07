"use client"; // Add this line to make it a client component

import React from 'react';
import './tools.css'; // Import the CSS file

const Tools = () => {
  const handleRedirect = (url) => {
    window.location.href = url; // Redirect to the specified URL
  };

  return (
    <div className="tools-container">
      <h1 className="tools-title">Our Tools</h1>
      <div className="tool-items">
        <div className="tool-item" onClick={() => handleRedirect('https://soiltestpro.com/')}>
          <div className="tool-image soil"></div>
          <div className="tool-info">
            <h3>Soil Testing</h3>
            <p>Get accurate soil analysis for better crop yield.</p>
            <a className="tool-link">Learn More</a>
          </div>
        </div>
        <div className="tool-item" onClick={() => handleRedirect('https://openweathermap.org/')}>
          <div className="tool-image weather"></div>
          <div className="tool-info">
            <h3>Weather Forecast</h3>
            <p>Stay updated with the latest weather information.</p>
            <a className="tool-link">Learn More</a>
          </div>
        </div>
        <div className="tool-item" onClick={() => handleRedirect('https://agrixp.com/')}>
          <div className="tool-image crop-planning"></div>
          <div className="tool-info">
            <h3>Crop Planning</h3>
            <p>Plan your crops effectively for maximum yield.</p>
            <a className="tool-link">Learn More</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
