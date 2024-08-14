"use client";

import Link from 'next/link';
import './navbar.css';

export default function Navbar() {
    return (
        <div className="nav">
            <div className="logo"></div>
            <div className="search">
<<<<<<< HEAD
                <input placeholder="Search the schemes..." />
                <div className="searchBtn"></div>
            </div>
            <div className="navLinks">
            <Link href="/Enter" className="enter">Back</Link>
               
                <Link href="/faqs" className="faqqs">FAQs</Link>
                <Link href="/tools" className="toolss">Tools</Link> {/* Add this line */}
            </div>
            <div className="profile">
                <Link href="/Profile">
                    <div className="profileIcon"></div>
                </Link>
=======
                <input palceholder="Search the schemes...">
                </input>
                <div className="searchBtn">
                    
                </div>
            </div>
            <div className="LoginRegister">
                <Link href="/login" className="login">Login</Link>
                <Link href="/login" className="register">Register</Link>
>>>>>>> 31321a7f6224e7d61b76d54baedbfcfbb28db89b
            </div>
        </div>
    );
}
<<<<<<< HEAD
=======

>>>>>>> 31321a7f6224e7d61b76d54baedbfcfbb28db89b
