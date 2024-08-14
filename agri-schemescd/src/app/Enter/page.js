"use client";

import { useState } from 'react';
import './enter.css';

export default function Enter() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Simulate a login action
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Simulate a logout action
    setIsLoggedIn(false);
  };

  return (
    <div className="enter">
      <nav className="navbar">
        <ul className="navbarList">
          <li>
            <button className="navButton" onClick={isLoggedIn ? () => alert('Welcome to Home!') : null}>
              Home
            </button>
          </li>
          {!isLoggedIn ? (
            <>
              <li>
                <button className="navButton" onClick={handleLogin}>
                  Login
                </button>
              </li>
              <li>
                <button className="navButton">
                  Register
                </button>
              </li>
            </>
          ) : (
            <li>
              <button className="navButton" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
      <div className="enterContent">
        {isLoggedIn ? (
          <h2>Welcome back! You are logged in.</h2>
        ) : (
          <h2>Please login or register to continue.</h2>
        )}
      </div>
    </div>
  );
}
