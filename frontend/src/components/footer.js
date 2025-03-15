import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>For Clients</h3>
                    <Link to="/how-to-hire">How to Hire</Link>
                    <Link to="/talent-marketplace">Talent Marketplace</Link>
                    <Link to="/project-catalog">Project Catalog</Link>
                    <Link to="/hire-agency">Hire an Agency</Link>
                    <Link to="/enterprise">Enterprise Solutions</Link>
                    <Link to="/business-plus">Business Plus</Link>
                    <Link to="/any-hire">Any Hire</Link>
                    <Link to="/contract-to-hire">Contract-to-Hire</Link>
                    <Link to="/direct-contracts">Direct Contracts</Link>
                    <Link to="/hire-worldwide">Hire Worldwide</Link>
                    <Link to="/hire-local">Hire in Your Country</Link>
                </div>
                
                <div className="footer-section">
                    <h3>For Job Seekers</h3>
                    <Link to="/how-to-find-work">How to Find Work</Link>
                    <Link to="/direct-contracts">Direct Contracts</Link>
                    <Link to="/worldwide-jobs">Find Freelance Jobs Worldwide</Link>
                    <Link to="/local-jobs">Find Freelance Jobs in Your Country</Link>
                    <Link to="/win-work-ads">Win Work with Ads</Link>
                    <Link to="/freelancer-plus">Exclusive Resources with Freelancer Plus</Link>
                </div>
                
                <div className="footer-section">
                    <h3>Resources</h3>
                    <Link to="/help-support">Help & Support</Link>
                    <Link to="/success-stories">Success Stories</Link>
                    <Link to="/reviews">Ajira Global Reviews</Link>
                    <Link to="/blog">Blog</Link>
                    <Link to="/affiliate">Affiliate Program</Link>
                    <Link to="/free-tools">Free Business Tools</Link>
                </div>

                <div className="footer-section">
                    <h3>Ajira Global</h3>
                    <Link to="/about">About Us</Link>
                    <Link to="/leadership">Leadership</Link>
                    <Link to="/investor-relations">Investor Relations</Link>
                    <Link to="/careers">Careers</Link>
                    <Link to="/our-impact">Our Impact</Link>
                    <Link to="/press">Press & Media</Link>
                    <Link to="/contact">Contact Us</Link>
                    <Link to="/partners">Partners</Link>
                    <Link to="/trust-safety">Trust, Safety & Security</Link>
                    <Link to="/legal">Legal & Compliance</Link>
                </div>
            </div>
            <div className="social-links">
                <a href="https://linkedin.com/company/ajiraglobal" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://twitter.com/ajiraglobal" target="_blank" rel="noopener noreferrer">Twitter</a>
                <a href="https://instagram.com/ajiraglobal" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Ajira Global. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
