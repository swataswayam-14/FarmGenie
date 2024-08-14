"use client";

import './register.css';

export default function Register() {
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
          <form className="registerBox">
            <input placeholder="Name" type="text" required className="registerInput" />
            <input placeholder="Age" type="number" required className="registerInput" />
            <input placeholder="Phone Number" type="tel" required className="registerInput" pattern="[0-9]{10}" />
            <input placeholder="Email" type="email" required className="registerInput" />
            <input placeholder="Password" className="registerInput" required minLength="6" type="password" />
            <input placeholder="Confirm Password" className="registerInput" required minLength="6" type="password" />
            <textarea placeholder="Additional Information (e.g., Land Area, Crop Type)" className="registerTextarea" rows="3"></textarea>
            <button className="registerButton" type="submit" disabled={false}>
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

