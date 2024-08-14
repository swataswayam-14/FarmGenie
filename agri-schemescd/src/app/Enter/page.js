"use client";

import Link from 'next/link';
import './enter.css';

export default function Navbar() {
    return (
        <div className="nav">
            <div className="logo"></div>
            <div className="search">
                <input placeholder="Search the schemes..." />
                <div className="searchBtn"></div>
            </div>
            <div className="navLinks">
                <Link href="/login" className="loginn">Login</Link>
                <Link href="/Register" className="registerr">Register</Link>
               
            </div>
            <div className="profile">
                <Link href="/Profile">
                    <div className="profileIcon"></div>
                </Link>
            </div>
            <div className="backButton">
                <Link href="./midBody">
                    <button className="backBtn">Back</button>
                </Link>
            </div>
        </div>
    );
}
