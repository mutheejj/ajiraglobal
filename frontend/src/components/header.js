import React, { useState } from 'react';
import logo from '../images/logo.jpg';
import { Link } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <br></br>
            <div className="logo-container">
                <Link to="/" className="logo">
                    <img src={logo} alt="AGlo Logo" className="logo-image" />
                    AjiraGlobal
                </Link>
            </div>
            
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Search jobs..."
                    className="search-input"
                />
                <button className="search-button">Search</button>
            </div>

            <div className="hamburger-menu" onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/jobs" className="nav-link">Find Jobs</Link>
                <Link to="/post-job" className="nav-link">Post Jobs</Link>
                <div className="auth-buttons">
                    <Link to="/login" className="auth-link">Login</Link>
                    <Link to="/signup" className="auth-link signup">Sign Up</Link>
                </div>
            </nav>
        </header>
    );
}

export default Header;
