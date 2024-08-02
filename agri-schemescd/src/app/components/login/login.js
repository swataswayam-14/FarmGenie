"use client";

import './login.css';

export default function Login() {
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <img src="/assets/logo.png" alt="Connectify Logo" className="loginLogoImage" />
          <h3 className="loginLogo typing">Connectify</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Connectify.
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

