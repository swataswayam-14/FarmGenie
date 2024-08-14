"use client";

import Link from 'next/link';
import './navbar.css';

export default function Navbar() {
    return (
        <div className="nav">
            <div className="logo"></div>
            <div className="search">
                <input palceholder="Search the schemes...">
                </input>
                <div className="searchBtn">
                    
                </div>
            </div>
            <div className="LoginRegister">
                <Link href="/login" className="login">Login</Link>
                <Link href="/login" className="register">Register</Link>
            </div>
        </div>
    );
}
