"use client"
import React, { useState } from 'react';
import { SignUpInterface } from '../utils/SignUpInterface';
import styles from "./SignUp.module.css"

export default function SignUp() {
  const [signUpData, setSignUpData] = useState<SignUpInterface>({
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    city: '',
    country: '',
    pinCode: '',
    address: '',
    username: '',
    password: '',
    category: 'farmer',
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setSignUpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission, e.g., send the signUpData to the server
    console.log('Submitted sign-up data:', signUpData);
  };

  return (
    <div className= {styles.signupForm}>
      <h2 className= {styles.title}>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={signUpData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={signUpData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="middleName">Middle Name:</label>
          <input
            type="text"
            id="middleName"
            name="middleName"
            value={signUpData.middleName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={signUpData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={signUpData.username}
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
            value={signUpData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={signUpData.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            name="country"
            value={signUpData.country}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="pinCode">Pin Code:</label>
          <input
            type="text"
            id="pinCode"
            name="pinCode"
            value={signUpData.pinCode}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={signUpData.address}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={signUpData.category}
            onChange={handleInputChange}
            required
          >
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
            <option value="retailer">Retailer</option>
          </select>
        </div>
        <button className={styles.submitButton} type="submit">Sign Up</button>
      </form>
    </div>
  );
}