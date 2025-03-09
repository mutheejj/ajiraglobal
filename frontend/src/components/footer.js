import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>for clients</h3>
                    <Link to="/about">About Us</Link>
                    <Link to="/jobs">Find Jobs</Link>
                    <Link to="/post-job">Post a Job</Link>
                    <Link to="/contact">Contact Us</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/jobs">Find Jobs</Link>
                    <Link to="/post-job">Post a Job</Link>
                    <Link to="/contact">Contact Us</Link>
                    
                </div>
                <div className="footer-section">
                    <h3>for job seekers</h3>
                    <Link to="/about">About Us</Link>
                    <Link to="/jobs">Find Jobs</Link>
                    <Link to="/post-job">Post a Job</Link>
                    <Link to="/contact">Contact Us</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/jobs">Find Jobs</Link>
                    <Link to="/post-job">Post a Job</Link>
                    <Link to="/contact">Contact Us</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/jobs">Find Jobs</Link>
                    <Link to="/post-job">Post a Job</Link>
                    <Link to="/contact">Contact Us</Link>
                </div>
                
                <div className="footer-section">
                    <h3>resources</h3>
                    <Link to="/about">About Us</Link>
                    <Link to="/jobs">Find Jobs</Link>
                    <Link to="/post-job">Post a Job</Link>
                    <Link to="/contact">Contact Us</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/jobs">Find Jobs</Link>
                    <Link to="/post-job">Post a Job</Link>
                    <Link to="/contact">Contact Us</Link>
                </div>

                <div className="footer-section">
                    <h3>ajiraglobal</h3>
                    <Link to="/about">About Us</Link>
                    <Link to="/jobs">Find Jobs</Link>
                    <Link to="/post-job">Post a Job</Link>
                    <Link to="/contact">Contact Us</Link>
                </div>
            </div>
            <div className='social-links'>
                <a href='URL_ADDRESS.linkedin.com/in/ajiraglobal/'>LinkedIn</a>
                <a href='URL_ADDRESS.twitter.com/ajiraglobal'>Twitter</a>
                <a href='URL_ADDRESS.instagram.com/ajiraglobal'>Instagram</a>

            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Ajira Global. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
