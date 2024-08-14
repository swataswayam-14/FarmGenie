"use client";

import './login.css';

export default function Login() {
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <div className="loginLogoImage" />
          <h3 className="loginLogo typing">FarmGenie</h3>
          <span className="loginDesc">
        
          Your one-stop solution for all farming needs. Connect, learn, and grow with a community that supports you every step of the way.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox">
            <input placeholder="Email" type="email" required className="loginInput" />
            <input placeholder="Password" className="loginInput" required minLength="6" type="password" />
            <button className="loginButton" type="submit" disabled={false}>
              Log In
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton">
              Create a new Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}                                        
