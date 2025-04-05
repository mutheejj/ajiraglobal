import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Divider,
  Avatar,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert,
  AlertTitle,
  Menu,
  MenuItem,
  ListItemIcon,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import TimelineIcon from '@mui/icons-material/Timeline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneIcon from '@mui/icons-material/Done';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import UpdateIcon from '@mui/icons-material/Update';

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  minWidth: 0,
  marginRight: theme.spacing(3),
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
}));

const ProfileSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  borderRadius: '10px',
  marginBottom: theme.spacing(3),
  position: 'relative',
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.lighter || theme.palette.primary.light,
  color: theme.palette.primary.dark,
  border: 'none',
}));

const StyledJobCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const ApplicationStatusChip = styled(Chip)(({ theme, status }) => {
  const statusColors = {
    pending: { bg: theme.palette.warning.light, color: theme.palette.warning.dark },
    accepted: { bg: theme.palette.success.light, color: theme.palette.success.dark },
    rejected: { bg: theme.palette.error.light, color: theme.palette.error.dark },
    withdrawn: { bg: theme.palette.grey[300], color: theme.palette.grey[700] },
  };
  
  const colorSet = statusColors[status] || statusColors.pending;
  
  return {
    backgroundColor: colorSet.bg,
    color: colorSet.color,
    fontWeight: 600,
    '& .MuiChip-label': {
      padding: '0 8px',
    },
  };
});

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
}));

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for all dashboard data
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  
  // Dialog states
  const [portfolioDialog, setPortfolioDialog] = useState({ open: false, mode: 'add', project: null });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, id: null });
  const [uploadDialog, setUploadDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    link: '',
    image: null,
    technologies: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  
  useEffect(() => {
    // Fetch all job seeker data on component mount
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch multiple data sources in parallel
      const [
        profileResponse, 
        applicationsResponse, 
        savedJobsResponse, 
        notificationsResponse,
        portfolioResponse
      ] = await Promise.all([
        axios.get('/api/jobseeker/profile/'),
        axios.get('/api/applications/jobseeker/'),
        axios.get('/jobs/saved/'),
        axios.get('/api/notifications/jobseeker/'),
        axios.get('/api/portfolio/projects/')
      ]);
      
      setProfile(profileResponse.data);
      setApplications(applicationsResponse.data);
      setSavedJobs(savedJobsResponse.data);
      setNotifications(notificationsResponse.data);
      setPortfolioProjects(portfolioResponse.data);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemId(id);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };
  
  const openConfirmDialog = (type) => {
    setConfirmDialog({ 
      open: true, 
      type: type,
      id: selectedItemId 
    });
    handleMenuClose();
  };
  
  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, type: null, id: null });
  };
  
  const handleConfirmAction = async () => {
    try {
      const { type, id } = confirmDialog;
      
      if (type === 'deletePortfolio') {
        await axios.delete(`/api/portfolio/projects/${id}/`);
        setPortfolioProjects(prev => prev.filter(project => project.id !== id));
        toast.success('Portfolio project deleted successfully');
      } 
      else if (type === 'withdrawApplication') {
        await axios.patch(`/api/applications/${id}/withdraw/`);
        setApplications(prev => prev.map(app => 
          app.id === id ? { ...app, status: 'withdrawn' } : app
        ));
        toast.success('Application withdrawn successfully');
      }
      else if (type === 'removeSavedJob') {
        await axios.delete(`/api/jobs/saved/${id}/`);
        setSavedJobs(prev => prev.filter(job => job.id !== id));
        toast.success('Job removed from saved list');
      }
      
      closeConfirmDialog();
    } catch (error) {
      console.error('Error performing action:', error);
      toast.error('Failed to perform action. Please try again.');
      closeConfirmDialog();
    }
  };
  
  const openPortfolioDialog = (mode, project = null) => {
    if (mode === 'edit' && project) {
      setProjectForm({
        title: project.title,
        description: project.description,
        link: project.link || '',
        image: null,
        technologies: project.technologies.join(', ')
      });
    } else {
      setProjectForm({
        title: '',
        description: '',
        link: '',
        image: null,
        technologies: ''
      });
    }
    
    setPortfolioDialog({ open: true, mode, project });
    handleMenuClose();
  };
  
  const closePortfolioDialog = () => {
    setPortfolioDialog({ open: false, mode: 'add', project: null });
  };
  
  const handleProjectFormChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files[0]) {
      setProjectForm(prev => ({
        ...prev,
        image: files[0]
      }));
    } else {
      setProjectForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('title', projectForm.title);
      formData.append('description', projectForm.description);
      
      if (projectForm.link) {
        formData.append('link', projectForm.link);
      }
      
      if (projectForm.image) {
        formData.append('image', projectForm.image);
      }
      
      formData.append('technologies', projectForm.technologies.split(',').map(tech => tech.trim()));
      
      let response;
      if (portfolioDialog.mode === 'edit') {
        response = await axios.put(
          `/api/portfolio/projects/${portfolioDialog.project.id}/`, 
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        setPortfolioProjects(prev => prev.map(project => 
          project.id === portfolioDialog.project.id ? response.data : project
        ));
        
        toast.success('Portfolio project updated successfully');
      } else {
        response = await axios.post(
          '/api/portfolio/projects/', 
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        setPortfolioProjects(prev => [...prev, response.data]);
        toast.success('Portfolio project added successfully');
      }
      
      closePortfolioDialog();
    } catch (error) {
      console.error('Error saving portfolio project:', error);
      toast.error('Failed to save portfolio project. Please try again.');
    }
  };
  
  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      
      await axios.post('/api/jobseeker/resume/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update profile with new resume info
      const profileResponse = await axios.get('/api/jobseeker/profile/');
      setProfile(profileResponse.data);
      
      toast.success('Resume uploaded successfully');
      setUploadDialog(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Dashboard statistics
  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(app => app.status === 'pending')?.length || 0;
  const acceptedApplications = applications?.filter(app => app.status === 'accepted')?.length || 0;
  const totalSavedJobs = savedJobs?.length || 0;
  
  // Render job card for saved jobs and applications
  const renderJobCard = (job, type = 'saved') => (
    <Grid item xs={12} sm={6} md={4} key={job.id}>
      <StyledJobCard>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h3" noWrap sx={{ maxWidth: '80%' }}>
              {job.title}
            </Typography>
            
            {type === 'application' && (
              <ApplicationStatusChip 
                label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                status={job.status}
                size="small"
              />
            )}
            
            {type === 'saved' && (
              <IconButton 
                size="small" 
                color="primary"
                onClick={() => {
                  setSelectedItemId(job.id);
                  openConfirmDialog('removeSavedJob');
                }}
              >
                <BookmarkIcon />
              </IconButton>
            )}
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            {job.company_name || 'Company'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {job.duration} days
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Budget:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {job.currency} {job.budget}
            </Typography>
          </Box>
          
          {type === 'application' && job.applied_at && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
              Applied: {formatDate(job.applied_at)}
            </Typography>
          )}
          
          {type === 'saved' && job.created_at && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
              Posted: {formatDate(job.created_at)}
            </Typography>
          )}
        </CardContent>
        
        <CardActions>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={() => navigate(`/jobs/${job.job_id || job.id}`)}
          >
            View Job
          </Button>
          
          {type === 'application' && job.status === 'pending' && (
            <Button 
              size="small" 
              color="error" 
              onClick={() => {
                setSelectedItemId(job.id);
                openConfirmDialog('withdrawApplication');
              }}
            >
              Withdraw
            </Button>
          )}
          
          {type === 'saved' && (
            <Button 
              size="small" 
              variant="contained" 
              onClick={() => navigate(`/jobs/${job.id}/apply`)}
            >
              Apply
            </Button>
          )}
        </CardActions>
      </StyledJobCard>
    </Grid>
  );
  
  // Render portfolio project card
  const renderPortfolioCard = (project) => (
    <Grid item xs={12} sm={6} md={4} key={project.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {project.image && (
          <Box 
            sx={{ 
              height: 160, 
              overflow: 'hidden',
              backgroundImage: `url(${project.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        )}
        
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {project.title}
            </Typography>
            <IconButton 
              size="small"
              onClick={(e) => handleMenuOpen(e, project.id)}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            {project.description}
          </Typography>
          
          <Box sx={{ mt: 1 }}>
            {project.technologies.map(tech => (
              <SkillChip key={tech} label={tech} size="small" />
            ))}
          </Box>
        </CardContent>
        
        <CardActions>
          {project.link && (
            <Button 
              size="small" 
              href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchData}
        >
          Retry
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Job Seeker Dashboard
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate('/profile/edit')}
            sx={{ mr: 2 }}
          >
            Edit Profile
          </Button>
          <Badge badgeContent={notifications.length} color="error">
            <IconButton color="primary">
              <NotificationsIcon />
            </IconButton>
          </Badge>
        </Box>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <WorkIcon fontSize="large" color="primary" sx={{ mb: 1 }} />
            <Typography variant="h5" component="div">
              {totalApplications}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Applications
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <UpdateIcon fontSize="large" color="warning" sx={{ mb: 1 }} />
            <Typography variant="h5" component="div">
              {pendingApplications}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <DoneIcon fontSize="large" color="success" sx={{ mb: 1 }} />
            <Typography variant="h5" component="div">
              {acceptedApplications}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accepted
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <BookmarkIcon fontSize="large" color="info" sx={{ mb: 1 }} />
            <Typography variant="h5" component="div">
              {totalSavedJobs}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saved Jobs
            </Typography>
          </StatCard>
        </Grid>
      </Grid>
      
      {/* Profile Summary Panel */}
      {profile && (
        <ProfileSection>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={profile.avatar || ''}
              sx={{ width: 80, height: 80, mr: 3 }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
            
            <Box>
              <Typography variant="h5" component="h2">
                {profile.full_name || 'Your Name'}
              </Typography>
              
              <Typography variant="body1" color="primary" gutterBottom>
                {profile.title || 'Your Title'}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label={profile.experience_level ? 
                    profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1) : 
                    "Experience Level"
                  } 
                  size="small" 
                  sx={{ mr: 1 }} 
                />
                
                <Chip 
                  label={profile.location || 'Location'} 
                  size="small" 
                  variant="outlined" 
                />
              </Box>
            </Box>
            
            <Box sx={{ ml: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={profile.resume_url ? <DownloadIcon /> : <CloudUploadIcon />}
                onClick={() => profile.resume_url ? window.open(profile.resume_url) : setUploadDialog(true)}
                sx={{ mb: 1 }}
              >
                {profile.resume_url ? 'Download Resume' : 'Upload Resume'}
              </Button>
              
              <Typography variant="caption" color="text.secondary">
                Profile Completion: 
                <Rating 
                  value={profile.profile_completion || 2.5} 
                  precision={0.5} 
                  size="small" 
                  readOnly 
                  sx={{ ml: 1 }}
                />
              </Typography>
            </Box>
          </Box>
          
          {profile.bio && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1">{profile.bio}</Typography>
            </Box>
          )}
          
          {profile.skills && profile.skills.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {profile.skills.map(skill => (
                <SkillChip key={skill} label={skill} />
              ))}
            </Box>
          )}
        </ProfileSection>
      )}
      
      {/* Tab Navigation */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <StyledTabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="dashboard tabs"
          >
            <StyledTab label="Applications" icon={<WorkIcon />} iconPosition="start" />
            <StyledTab label="Saved Jobs" icon={<BookmarkIcon />} iconPosition="start" />
            <StyledTab label="Portfolio" icon={<FolderSpecialIcon />} iconPosition="start" />
            <StyledTab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
          </StyledTabs>
        </Box>
        
        {/* Applications Tab */}
        {tabValue === 0 && (
          <Box sx={{ mt: 3 }}>
            {applications.length > 0 ? (
              <Grid container spacing={3}>
                {applications.map(application => renderJobCard(application, 'application'))}
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  You haven't applied to any jobs yet.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/jobs')}
                >
                  Browse Jobs
                </Button>
              </Paper>
            )}
          </Box>
        )}
        
        {/* Saved Jobs Tab */}
        {tabValue === 1 && (
          <Box sx={{ mt: 3 }}>
            {savedJobs.length > 0 ? (
              <Grid container spacing={3}>
                {savedJobs.map(job => renderJobCard(job))}
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  You haven't saved any jobs yet.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/jobs')}
                >
                  Browse Jobs
                </Button>
              </Paper>
            )}
          </Box>
        )}
        
        {/* Portfolio Tab */}
        {tabValue === 2 && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => openPortfolioDialog('add')}
              >
                Add Project
              </Button>
            </Box>
            
            {portfolioProjects.length > 0 ? (
              <Grid container spacing={3}>
                {portfolioProjects.map(project => renderPortfolioCard(project))}
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  You haven't added any portfolio projects yet.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => openPortfolioDialog('add')}
                >
                  Add Your First Project
                </Button>
              </Paper>
            )}
          </Box>
        )}
        
        {/* Notifications Tab */}
        {tabValue === 3 && (
          <Box sx={{ mt: 3 }}>
            {notifications.length > 0 ? (
              <Paper>
                <List sx={{ width: '100%' }}>
                  {notifications.map(notification => (
                    <ListItem
                      key={notification.id}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      }
                      divider
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: notification.read ? 'grey.300' : 'primary.light' }}>
                          {notification.type === 'application_status' ? (
                            <WorkIcon />
                          ) : notification.type === 'message' ? (
                            <SendIcon />
                          ) : (
                            <NotificationsIcon />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={notification.title}
                        secondary={
                          <>
                            <Typography 
                              component="span" 
                              variant="body2"
                              sx={{ display: 'block' }}
                            >
                              {notification.message}
                            </Typography>
                            <Typography 
                              component="span" 
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block' }}
                            >
                              {formatDate(notification.created_at)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  You don't have any notifications yet.
                </Typography>
              </Paper>
            )}
          </Box>
        )}
      </Box>
      
      {/* Portfolio Project Dialog */}
      <Dialog open={portfolioDialog.open} onClose={closePortfolioDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {portfolioDialog.mode === 'edit' ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleProjectSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Project Title"
                  name="title"
                  value={projectForm.title}
                  onChange={handleProjectFormChange}
                  fullWidth
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={projectForm.description}
                  onChange={handleProjectFormChange}
                  multiline
                  rows={4}
                  fullWidth
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Project URL"
                  name="link"
                  value={projectForm.link}
                  onChange={handleProjectFormChange}
                  fullWidth
                  placeholder="e.g., https://github.com/username/project"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Technologies Used (comma separated)"
                  name="technologies"
                  value={projectForm.technologies}
                  onChange={handleProjectFormChange}
                  fullWidth
                  required
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Project Image
                  <input
                    type="file"
                    name="image"
                    hidden
                    accept="image/*"
                    onChange={handleProjectFormChange}
                  />
                </Button>
                {projectForm.image && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected file: {typeof projectForm.image === 'string' ? 
                      projectForm.image : projectForm.image.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePortfolioDialog}>Cancel</Button>
          <Button 
            onClick={handleProjectSubmit}
            variant="contained"
          >
            {portfolioDialog.mode === 'edit' ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Resume Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Resume</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please upload your latest resume in PDF, DOC, or DOCX format.
          </DialogContentText>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            fullWidth
          >
            Select File
            <input
              type="file"
              hidden
              accept=".pdf,.doc,.docx"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </Button>
          {selectedFile && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Selected file: {selectedFile.name}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleFileUpload}
            variant="contained"
            disabled={!selectedFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Portfolio Project Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={() => {
            const project = portfolioProjects.find(p => p.id === selectedItemId);
            openPortfolioDialog('edit', project);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={() => openConfirmDialog('deletePortfolio')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
      >
        <DialogTitle>
          {confirmDialog.type === 'deletePortfolio' && "Delete Portfolio Project"}
          {confirmDialog.type === 'withdrawApplication' && "Withdraw Application"}
          {confirmDialog.type === 'removeSavedJob' && "Remove Saved Job"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.type === 'deletePortfolio' && 
              "Are you sure you want to delete this portfolio project? This action cannot be undone."}
            {confirmDialog.type === 'withdrawApplication' && 
              "Are you sure you want to withdraw this application? You can't reapply for this job once withdrawn."}
            {confirmDialog.type === 'removeSavedJob' && 
              "Are you sure you want to remove this job from your saved list?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} autoFocus>Cancel</Button>
          <Button 
            onClick={handleConfirmAction} 
            color="error"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobSeekerDashboard;