import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Tabs,
  Tab,
  Divider,
  TextField,
  CircularProgress,
  Badge,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Rating
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  marginBottom: theme.spacing(3),
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
}));

const ProfileHeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '10px',
  marginBottom: theme.spacing(3),
  position: 'relative',
  backgroundImage: 'linear-gradient(to right, #e3f2fd, #bbdefb)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: 'flex', 
  alignItems: 'center', 
  marginBottom: theme.spacing(2)
}));

const JobCard = styled(Card)(({ theme }) => ({
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

const JobStatusChip = styled(Chip)(({ theme, status }) => {
  const statusColors = {
    active: { bg: theme.palette.success.light, color: theme.palette.success.dark },
    paused: { bg: theme.palette.warning.light, color: theme.palette.warning.dark },
    closed: { bg: theme.palette.error.light, color: theme.palette.error.dark },
    draft: { bg: theme.palette.grey[200], color: theme.palette.grey[700] },
  };
  
  const colorSet = statusColors[status] || statusColors.draft;
  
  return {
    backgroundColor: colorSet.bg,
    color: colorSet.color,
    fontWeight: 600,
    '& .MuiChip-label': {
      padding: '0 8px',
    },
  };
});

const ClientProfile = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State variables for profile data
  const [companyProfile, setCompanyProfile] = useState(null);
  const [recruitmentSettings, setRecruitmentSettings] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch data sources in parallel
      const [
        companyResponse, 
        settingsResponse, 
        jobsResponse
      ] = await Promise.all([
        axios.get('/api/company/profile/'),
        axios.get('/api/company/settings/'),
        axios.get('/api/jobs/company/recent/')
      ]);
      
      setCompanyProfile(companyResponse.data);
      setRecruitmentSettings(settingsResponse.data);
      setRecentJobs(jobsResponse.data);
      
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data. Please try again later.');
      toast.error('Error loading profile data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleLogoUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('logo', selectedFile);
      
      await axios.post('/api/company/logo/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update profile with new logo
      const profileResponse = await axios.get('/api/company/profile/');
      setCompanyProfile(profileResponse.data);
      
      toast.success('Logo uploaded successfully');
      setUploadDialog(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getJobStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'paused': return 'Paused';
      case 'closed': return 'Closed';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };
  
  const renderRecentJobCard = (job) => (
    <Grid item xs={12} sm={6} md={4} key={job.id}>
      <JobCard>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h3" noWrap>
              {job.title}
            </Typography>
            <JobStatusChip 
              label={getJobStatusLabel(job.status)}
              status={job.status}
              size="small"
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {job.description && job.description.length > 100 
              ? `${job.description.substring(0, 100)}...` 
              : job.description}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Budget:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {job.currency} {job.budget}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Applications:</Typography>
            <Typography variant="body2">
              {job.applications_count || 0}
            </Typography>
          </Box>
          
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
            Posted: {formatDate(job.created_at)}
          </Typography>
        </CardContent>
        
        <CardActions>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            View Details
          </Button>
          <Button 
            size="small" 
            variant="text" 
            color="primary"
            onClick={() => navigate(`/jobs/${job.id}/edit`)}
          >
            Edit
          </Button>
        </CardActions>
      </JobCard>
    </Grid>
  );

  const renderCompanyDetails = () => {
    if (!companyProfile) return null;
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ProfileSection>
            <Typography variant="h6" gutterBottom>Company Information</Typography>
            <List>
              <ListItem divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <BusinessIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Company Name" 
                  secondary={companyProfile.name || 'Not specified'} 
                />
              </ListItem>
              
              <ListItem divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <LanguageIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Website" 
                  secondary={companyProfile.website || 'Not specified'} 
                />
              </ListItem>
              
              <ListItem divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <WorkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Industry" 
                  secondary={companyProfile.industry || 'Not specified'} 
                />
              </ListItem>
              
              <ListItem divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <CalendarTodayIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Founded" 
                  secondary={companyProfile.founded_year || 'Not specified'} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <PeopleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Company Size" 
                  secondary={companyProfile.company_size || 'Not specified'} 
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button 
                startIcon={<EditIcon />} 
                variant="outlined"
                onClick={() => navigate('/company/edit')}
              >
                Edit Information
              </Button>
            </Box>
          </ProfileSection>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ProfileSection>
            <Typography variant="h6" gutterBottom>Contact Information</Typography>
            <List>
              <ListItem divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'info.light' }}>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Email" 
                  secondary={companyProfile.email || 'Not specified'} 
                />
              </ListItem>
              
              <ListItem divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'info.light' }}>
                    <PhoneIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Phone" 
                  secondary={companyProfile.phone || 'Not specified'} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'info.light' }}>
                    <LocationOnIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Address" 
                  secondary={companyProfile.address || 'Not specified'} 
                />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>Social Media</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {companyProfile.social_links && companyProfile.social_links.map((link, index) => (
                <Grid item key={index}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.platform}
                  </Button>
                </Grid>
              ))}
              
              {(!companyProfile.social_links || companyProfile.social_links.length === 0) && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    No social media links added
                  </Typography>
                </Grid>
              )}
            </Grid>
            
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button 
                startIcon={<EditIcon />} 
                variant="outlined"
                onClick={() => navigate('/company/contact/edit')}
              >
                Edit Contact Info
              </Button>
            </Box>
          </ProfileSection>
        </Grid>
        
        <Grid item xs={12}>
          <ProfileSection>
            <Typography variant="h6" gutterBottom>About</Typography>
            {companyProfile.description ? (
              <Typography variant="body1" paragraph>
                {companyProfile.description}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No company description provided. Add a compelling description to tell job seekers about your company.
              </Typography>
            )}
            
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button 
                startIcon={<EditIcon />} 
                variant="outlined"
                onClick={() => navigate('/company/about/edit')}
              >
                Edit About
              </Button>
            </Box>
          </ProfileSection>
        </Grid>
      </Grid>
    );
  };
  
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
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/client-dashboard')}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </Button>
      
      {/* Profile Header */}
      <ProfileHeaderPaper elevation={3}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={2}>
            <Avatar
              src={companyProfile?.logo || ''}
              sx={{ 
                width: { xs: 100, sm: 120 }, 
                height: { xs: 100, sm: 120 },
                mx: { xs: 'auto', sm: 0 }
              }}
              variant="rounded"
            >
              <BusinessIcon fontSize="large" />
            </Avatar>
          </Grid>
          
          <Grid item xs={12} sm={7}>
            <Typography variant="h4" component="h1" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              {companyProfile?.name || 'Your Company'}
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ mb: 1, textAlign: { xs: 'center', sm: 'left' } }}
            >
              {companyProfile?.industry || 'Industry'}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: { xs: 'center', sm: 'flex-start' },
              flexWrap: 'wrap'
            }}>
              {companyProfile?.location && (
                <Chip 
                  icon={<LocationOnIcon />}
                  label={companyProfile.location} 
                  size="small" 
                  sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
                />
              )}
              
              {companyProfile?.company_size && (
                <Chip 
                  icon={<PeopleIcon />}
                  label={`${companyProfile.company_size} employees`} 
                  size="small" 
                  variant="outlined" 
                  sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
                />
              )}
              
              {companyProfile?.rating && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  ml: { xs: 0, sm: 2 },
                  mt: { xs: 1, sm: 0 }
                }}>
                  <Rating 
                    value={companyProfile.rating} 
                    precision={0.1} 
                    size="small" 
                    readOnly 
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    ({companyProfile.reviews || 0})
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={3} sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={() => setUploadDialog(true)}
              fullWidth
              sx={{ mb: 1 }}
            >
              Upload Logo
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate('/company/edit')}
              fullWidth
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </ProfileHeaderPaper>
      
      {/* Tab Navigation */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <StyledTabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="profile tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <StyledTab label="Company Profile" icon={<BusinessIcon />} iconPosition="start" />
            <StyledTab label="Recent Jobs" icon={<WorkIcon />} iconPosition="start" />
            <StyledTab label="Settings" icon={<SettingsIcon />} iconPosition="start" />
          </StyledTabs>
        </Box>
        
        {/* Company Profile Tab */}
        {tabValue === 0 && (
          <Box sx={{ mt: 3 }}>
            {renderCompanyDetails()}
          </Box>
        )}
        
        {/* Recent Jobs Tab */}
        {tabValue === 1 && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Recent Jobs</Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/jobs/create')}
              >
                Post New Job
              </Button>
            </Box>
            
            {recentJobs && recentJobs.length > 0 ? (
              <Grid container spacing={3}>
                {recentJobs.map(job => renderRecentJobCard(job))}
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  You haven't posted any jobs yet.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/jobs/create')}
                >
                  Post Your First Job
                </Button>
              </Paper>
            )}
          </Box>
        )}
        
        {/* Settings Tab */}
        {tabValue === 2 && (
          <Box sx={{ mt: 3 }}>
            <ProfileSection>
              <Typography variant="h6" gutterBottom>Recruitment Settings</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Default Application Instructions"
                    multiline
                    rows={4}
                    fullWidth
                    value={recruitmentSettings?.default_instructions || ''}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Application Requirements
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {recruitmentSettings?.application_requirements?.map((req, index) => (
                        <Chip key={index} label={req} />
                      ))}
                      
                      {(!recruitmentSettings?.application_requirements || 
                        recruitmentSettings.application_requirements.length === 0) && (
                        <Typography variant="body2" color="text.secondary">
                          No application requirements specified
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Notification Preferences
                    </Typography>
                    {recruitmentSettings?.notification_preferences?.map((pref, index) => (
                      <Chip 
                        key={index} 
                        label={pref} 
                        variant="outlined" 
                        sx={{ mr: 1, mb: 1 }} 
                      />
                    ))}
                    
                    {(!recruitmentSettings?.notification_preferences || 
                      recruitmentSettings.notification_preferences.length === 0) && (
                      <Typography variant="body2" color="text.secondary">
                        No notification preferences specified
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Button 
                  startIcon={<SettingsIcon />} 
                  variant="outlined"
                  onClick={() => navigate('/company/settings')}
                >
                  Edit Settings
                </Button>
              </Box>
            </ProfileSection>
            
            <ProfileSection>
              <Typography variant="h6" gutterBottom>Billing & Subscription</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Current Plan
                </Typography>
                <Typography variant="h5" color="primary">
                  {companyProfile?.subscription_plan || 'Free Plan'}
                </Typography>
                {companyProfile?.subscription_expires && (
                  <Typography variant="body2" color="text.secondary">
                    Expires: {formatDate(companyProfile.subscription_expires)}
                  </Typography>
                )}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button 
                  variant="contained"
                  onClick={() => navigate('/billing')}
                >
                  Manage Subscription
                </Button>
              </Box>
            </ProfileSection>
          </Box>
        )}
      </Box>
      
      {/* Logo Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Company Logo</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please upload your company logo. Recommended size is 400x400 pixels.
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
              accept="image/*"
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
            onClick={handleLogoUpload}
            variant="contained"
            disabled={!selectedFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClientProfile; 