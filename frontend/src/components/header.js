import React, { useState } from 'react';
import logo from '../images/logo.jpg';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, logout } = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleProfileMenuClose();
        logout();
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
                    {user ? (
                        <>
                            <IconButton
                                onClick={handleProfileMenuOpen}
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                {user.avatar ? (
                                    <Avatar src={user.avatar} alt={user.name} />
                                ) : (
                                    <AccountCircleIcon />
                                )}
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleProfileMenuClose}
                                onClick={handleProfileMenuClose}
                            >
                                <MenuItem component={Link} to={user.userType === 'client' ? '/client-dashboard' : '/job-seeker-dashboard'}>
                                    Dashboard
                                </MenuItem>
                                <MenuItem component={Link} to="/profile">
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="auth-link">Login</Link>
                            <Link to="/signup" className="auth-link signup">Sign Up</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;
