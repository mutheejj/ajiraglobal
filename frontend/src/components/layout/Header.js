import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Divider,
  ListItemIcon,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Badge
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WorkIcon from '@mui/icons-material/Work';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(0, 5),
  },
}));

const LogoTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '.2rem',
  color: 'inherit',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '1rem',
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '&.active': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

const MobileNavItem = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  '&.active': {
    backgroundColor: theme.palette.action.selected,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: 1,
  color: theme.palette.primary.main,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 260,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout, isAuthenticated, user } = useAuth();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [userType, setUserType] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      // Determine if the user is a job seeker or client
      const userTypeFromStorage = localStorage.getItem('userType');
      setUserType(userTypeFromStorage);
      
      // Fetch notifications based on user type
      const endpoint = userTypeFromStorage === 'jobseeker' 
        ? '/api/notifications/jobseeker/' 
        : '/api/notifications/company/';
      
      axios.get(endpoint)
        .then(response => {
          setNotifications(response.data || []);
        })
        .catch(error => {
          console.error('Error fetching notifications:', error);
        });
    }
  }, [isAuthenticated, user]);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };
  
  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation items based on user type
  const getNavigationItems = () => {
    if (userType === 'jobseeker') {
      return [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'My Profile', icon: <PersonIcon />, path: '/profile' },
        { text: 'Saved Jobs', icon: <BookmarkIcon />, path: '/saved-jobs' },
        { text: 'My Applications', icon: <ArticleIcon />, path: '/applications' },
        { text: 'Messages', icon: <MessageIcon />, path: '/messages' },
      ];
    } else {
      // Client/Employer navigation
      return [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/client-dashboard' },
        { text: 'Post a Job', icon: <AddIcon />, path: '/jobs/create' },
        { text: 'My Jobs', icon: <WorkIcon />, path: '/jobs/company' },
        { text: 'Company Profile', icon: <BusinessIcon />, path: '/client-profile' },
        { text: 'Messages', icon: <MessageIcon />, path: '/messages' },
      ];
    }
  };
  
  const navigationItems = getNavigationItems();
  
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => {
        handleMenuClose();
        navigate(userType === 'jobseeker' ? '/profile' : '/client-profile');
      }}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>My Profile</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => {
        handleMenuClose();
        navigate('/settings');
      }}>
        <ListItemIcon>
          <TuneIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );
  
  const notificationsMenu = (
    <Menu
      anchorEl={notificationsAnchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(notificationsAnchorEl)}
      onClose={handleNotificationsClose}
      sx={{ maxHeight: 300 }}
    >
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <MenuItem key={notification.id || index} onClick={handleNotificationsClose}>
            <ListItemText 
              primary={notification.title} 
              secondary={notification.description}
            />
          </MenuItem>
        ))
      ) : (
        <MenuItem onClick={handleNotificationsClose}>
          <ListItemText primary="No new notifications" />
        </MenuItem>
      )}
      {notifications.length > 0 && (
        <MenuItem onClick={() => {
          handleNotificationsClose();
          navigate('/notifications');
        }}>
          <ListItemText primary="See all notifications" sx={{ textAlign: 'center', color: 'primary.main' }} />
        </MenuItem>
      )}
    </Menu>
  );
  
  // Mobile drawer content
  const drawer = (
    <Box>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Logo variant="h6" component={RouterLink} to="/">
          AjiraGlobal
        </Logo>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => handleNavigate(item.path)}
            selected={isActive(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
  
  return (
    <>
      <StyledAppBar position="sticky">
        <Container maxWidth="xl">
          <StyledToolbar disableGutters>
            {/* Logo and Mobile Menu Button */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Logo variant="h6" component={RouterLink} to="/">
                AjiraGlobal
              </Logo>
            </Box>
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {navigationItems.map((item) => (
                  <NavButton
                    key={item.text}
                    color={isActive(item.path) ? 'primary' : 'inherit'}
                    startIcon={item.icon}
                    onClick={() => handleNavigate(item.path)}
                    variant={isActive(item.path) ? 'contained' : 'text'}
                  >
                    {item.text}
                  </NavButton>
                ))}
              </Box>
            )}
            
            {/* Notification and Profile Icons */}
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Notifications">
                  <IconButton
                    size="large"
                    aria-label={`show ${notifications.length} new notifications`}
                    color="inherit"
                    onClick={handleNotificationsOpen}
                  >
                    <Badge badgeContent={notifications.length} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Account">
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    {user?.avatar ? (
                      <Avatar 
                        src={user.avatar} 
                        alt={user.name} 
                        sx={{ width: 32, height: 32 }}
                      />
                    ) : (
                      <AccountCircleIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Box>
                <NavButton 
                  color="inherit" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </NavButton>
                <NavButton 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </NavButton>
              </Box>
            )}
          </StyledToolbar>
        </Container>
      </StyledAppBar>
      
      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </MobileDrawer>
      
      {renderMenu}
      {notificationsMenu}
    </>
  );
};

export default Header; 