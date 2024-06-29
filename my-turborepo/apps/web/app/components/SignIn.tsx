"use client"
import { LoginInterface } from "../utils/LoginInterface";
import React, {useState} from "react";
import styles from "./SignUp.module.css"


export default function SignIn() {
    const [loginData, setLoginData] = useState<LoginInterface>({
      username: '',
      password: ''
    });
  
    const handleInputChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = event.target;
      setLoginData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Handle form submission, e.g., send the signUpData to the server
      console.log('Submitted login data:', loginData);
    };
  
    return (
      <div className= {styles.signupForm}>
        <h2 className= {styles.title}>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={loginData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="text"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button className={styles.submitButton} type="submit">Sign In</button>
        </form>
      </div>
    );
  }