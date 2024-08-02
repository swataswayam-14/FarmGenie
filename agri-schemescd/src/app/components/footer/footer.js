import "./footer.css";
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="contact-info">
                    <div className="contact-item">
                        <FaPhoneAlt className="icon" />
                        <span className="contact-text">+1-234-567-8901</span>
                    </div>
                    <div className="contact-item">
                        <FaEnvelope className="icon" />
                        <span className="contact-text">info@example.com</span>
                    </div>
                </div>
                <div className="social-media">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="social-icon" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebook className="social-icon" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter className="social-icon" />
                    </a>
                </div>
            </div>
        </footer>
    );
}

