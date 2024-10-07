import Link from 'next/link';
import './enter.css';

function Navbar() {
    return (
        <div className="nav">
            <div className="backButton">
                <Link href="/main">
                    <button className="backBtn">Home</button>
                </Link>
            </div>
            <div className="logo">FarmGenie</div>
            <div className="search">
                <input placeholder="Search the schemes..." />
                <div className="searchBtn">Search</div>
            </div>
            <div className="navLinks">
                <Link href="/login" className="loginn">Login</Link>
                <Link href="/Register" className="registerr">Register</Link>
                <Link href="/About" className="aboutt">About</Link>
            </div>
            <div className="profile">
                <Link href="/Profile">
                    <div className="profileIcon"></div>
                </Link>
            </div>
        </div>
    );
}

export default function EnterPage() {
    return (
        <div>
            <Navbar />
            <div className="welcomeSection">
                <div className="welcomeText">
                    <h1>Welcome to FarmGenie</h1>
                    <p>Your one-stop solution for all your farming needs. Discover government schemes, policies, and incentives designed specifically for farmers like you.</p>
                </div>
                <div className="circularImage1"></div>
            </div>

            <div className="boundary"></div>

            <div className="featuresSection">
            <div className="circularImage2"></div>
                <h2 >Features</h2>
               
                <ul>
                    <li><strong>Explore Schemes:</strong> Browse through a comprehensive list of government schemes tailored for farmers.</li>
                    <li><strong>Easy Registration:</strong> Quickly register to access personalized information and benefits.</li>
                    <li><strong>Search Functionality:</strong> Use our search bar to find specific schemes or information relevant to your needs.</li>
                    <li><strong>Profile Management:</strong> Create and manage your profile to receive updates on new schemes and policies.</li>
                </ul>
            </div>

            <div className="boundary"></div>
            
            <div className="howItWorksSection">
                <h2>How It Works</h2>
                <ol>
                    <li><strong>Sign Up:</strong> Create your account by registering with your details.</li>
                    <li><strong>Search for Schemes:</strong> Utilize the search bar to find schemes that suit your agricultural practices.</li>
                    <li><strong>Stay Updated:</strong> Receive notifications about new schemes and updates relevant to your profile.</li>
                    <li><strong>Get Support:</strong> Access FAQs and customer support for any assistance you may need.</li>
                </ol>
            </div>

            <div className="boundary"></div>

            <div className="callToActionSection">
                <h2>Ready to Get Started?</h2>
                <p>Join our community of farmers and start benefiting from the available schemes today!</p>
                <Link href="/Register">
                    <button className="ctaButton">Register Now</button>
                </Link>
            </div>
        </div>
    );
}
