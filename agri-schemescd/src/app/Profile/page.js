// profile.js

import './profile.css';
import Link from 'next/link';

const Profile = () => {
    return (
        <div className="profileContainer">
            <Link href="/" className="back">
                Back
            </Link>
            <div className="profileCard">
                <div className="profileHeader">
                    <div className="profilePicture" />
                    <h1 className="name">Rakesh Kumar</h1>
                </div>
                <div className="profileDetails">
                    <div className="profileDetail">
                        <span className="detailLabel">Age:</span>
                        <span className="detailValue">45</span>
                    </div>
                    <div className="profileDetail">
                        <span className="detailLabel">Email:</span>
                        <span className="detailValue">rakesh.kumar@example.com</span>
                    </div>
                    <div className="profileDetail">
                        <span className="detailLabel">Phone:</span>
                        <span className="detailValue">+1234567890</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;



