import React, { useState } from 'react';
import logo from '../images/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar, Menu, MenuItem, IconButton, InputBase, Paper, IconButton as MuiIconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useAuth();
    const { mode, toggleTheme } = useTheme();
    const navigate = useNavigate();

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
        <header style={{
            backgroundColor: mode === 'dark' ? '#121212' : '#fff',
            color: mode === 'dark' ? '#fff' : '#000',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            transition: 'all 0.3s ease',
            flexWrap: 'wrap',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexGrow: 1, minWidth: '200px' }}>
                <Link to="/" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    textDecoration: 'none',
                    color: mode === 'dark' ? '#fff' : '#000'
                }}>
                    <img src={logo} alt="AGlo Logo" style={{ height: '40px' }} />
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>AjiraGlobal</span>
                </Link>
            </div>
            
            <Paper
                component="form"
                sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: { xs: '100%', sm: '400px' },
                    order: { xs: 3, sm: 'initial' },
                    bgcolor: mode === 'dark' ? 'background.paper' : '#fff',
                    boxShadow: mode === 'dark' ? '0 2px 4px rgba(255,255,255,0.1)' : '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                        navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
                    }
                }}
            >
                <InputBase
                    sx={{
                        ml: 1,
                        flex: 1,
                        color: mode === 'dark' ? '#fff' : '#000'
                    }}
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton 
                    type="submit" 
                    sx={{ 
                        p: '10px',
                        color: mode === 'dark' ? '#fff' : '#000'
                    }}
                >
                    <SearchIcon />
                </IconButton>
            </Paper>

            <nav style={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: '2rem'
            }}>
                <Link to="/" style={{ color: mode === 'dark' ? '#fff' : '#000', textDecoration: 'none' }}>Home</Link>
                <Link to="/jobs" style={{ color: mode === 'dark' ? '#fff' : '#000', textDecoration: 'none' }}>Find Jobs</Link>
                <Link to="/post-job" style={{ color: mode === 'dark' ? '#fff' : '#000', textDecoration: 'none' }}>Post Jobs</Link>
            </nav>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
                <MuiIconButton
                    onClick={() => toggleTheme(mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light')}
                    sx={{
                        color: mode === 'dark' ? '#fff' : '#000',
                        '&:hover': {
                            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    {mode === 'light' ? <Brightness4Icon /> :
                     mode === 'dark' ? <SettingsBrightnessIcon /> :
                     <Brightness7Icon />}
                </MuiIconButton>
                
                {user ? (
                    <>
                        <IconButton
                            onClick={handleProfileMenuOpen}
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-haspopup="true"
                            sx={{
                                color: mode === 'dark' ? '#fff' : '#000',
                                '&:hover': {
                                    backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            {user.avatar ? (
                                <Avatar src={user.avatar} alt={user.name} />
                            ) : (
                                <AccountCircleIcon />
                            )}
                        </IconButton>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link 
                            to="/login" 
                            style={{ 
                                color: mode === 'dark' ? '#fff' : '#000',
                                textDecoration: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                border: `1px solid ${mode === 'dark' ? '#fff' : '#000'}`
                            }}
                        >
                            Login
                        </Link>
                        <Link 
                            to="/signup"
                            style={{ 
                                color: mode === 'dark' ? '#000' : '#fff',
                                backgroundColor: mode === 'dark' ? '#fff' : '#000',
                                textDecoration: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px'
                            }}
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                onClick={handleProfileMenuClose}
                PaperProps={{
                    sx: {
                        bgcolor: mode === 'dark' ? '#121212' : '#fff',
                        color: mode === 'dark' ? '#fff' : '#000'
                    }
                }}
            >
                <MenuItem 
                    component={Link} 
                    to={user.userType === 'client' ? '/client-dashboard' : '/job-seeker-dashboard'}
                    sx={{
                        color: mode === 'dark' ? '#fff' : '#000',
                        '&:hover': {
                            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    Dashboard
                </MenuItem>
                <MenuItem 
                    component={Link} 
                    to="/profile"
                    sx={{
                        color: mode === 'dark' ? '#fff' : '#000',
                        '&:hover': {
                            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    Profile
                </MenuItem>
                <MenuItem 
                    onClick={handleLogout}
                    sx={{
                        color: mode === 'dark' ? '#fff' : '#000',
                        '&:hover': {
                            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    Logout
                </MenuItem>
            </Menu>
        </header>
    );
};

export default Header;
