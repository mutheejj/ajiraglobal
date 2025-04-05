import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, TextField, MenuItem, Chip, Card, CardContent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch, Avatar, LinearProgress, Divider, Alert, Snackbar, InputAdornment, Menu } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, Business as BusinessIcon, People as PeopleIcon, Assessment as AssessmentIcon, Timeline as TimelineIcon, Work as WorkIcon, Person as PersonIcon, Refresh as RefreshIcon, MoreVert as MoreVertIcon, VisibilityOff as VisibilityOffIcon, Pause as PauseIcon, PlayArrow as PlayArrowIcon, Drafts as DraftsIcon, HowToReg as HowToRegIcon, Cancel as CancelIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Tabs,
  Tab,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondary,
  CircularProgress
} from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';

const categories = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Content Writing',
  'Digital Marketing',
  'Data Science',
  'Graphic Design',
  'Video Editing',
  'Virtual Assistant',
  'Other'
];

const initialJobForm = {
  title: '',
  category: '',
  description: '',
  requirements: '',
  skills: [],
  experience_level: '',
  project_type: '',
  budget: '',
  currency: 'KSH',
  duration: '',
  location: '',
  remote_work: false,
  status: 'draft'
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '10px',
  boxShadow: theme.shadows[2],
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const StyledTab = muiStyled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  minWidth: 0,
  marginRight: theme.spacing(3),
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

const StyledTabs = muiStyled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
}));

const StyledCard = muiStyled(Card)(({ theme }) => ({
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

const JobStatusChip = muiStyled(Chip)(({ theme, status }) => {
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

const StatCard = muiStyled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
}));

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State variables for all dashboard data
  const [jobs, setJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [pausedJobs, setPausedJobs] = useState([]);
  const [draftJobs, setDraftJobs] = useState([]);
  const [closedJobs, setClosedJobs] = useState([]);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [recruitmentSettings, setRecruitmentSettings] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState({ open: false, jobId: null, action: null });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  
  useEffect(() => {
    // Fetch all client data on component mount
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch multiple data sources in parallel
      const [
        jobsResponse, 
        companyResponse, 
        settingsResponse, 
        applicationsResponse,
        notificationsResponse
      ] = await Promise.all([
        axios.get('/api/jobs/company/'),
        axios.get('/api/company/profile/'),
        axios.get('/api/company/settings/'),
        axios.get('/api/applications/company/recent/'),
        axios.get('/api/notifications/company/')
      ]);
      
      // Process job data
      const allJobs = jobsResponse.data;
      setJobs(allJobs);
      
      // Categorize jobs by status
      setActiveJobs(allJobs.filter(job => job.status === 'active'));
      setPausedJobs(allJobs.filter(job => job.status === 'paused'));
      setDraftJobs(allJobs.filter(job => job.status === 'draft'));
      setClosedJobs(allJobs.filter(job => job.status === 'closed'));
      
      // Set other data
      setCompanyProfile(companyResponse.data);
      setRecruitmentSettings(settingsResponse.data);
      setRecentApplications(applicationsResponse.data);
      setNotifications(notificationsResponse.data);
      
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
  
  const handleJobAction = async (jobId, action) => {
    try {
      let endpoint = '';
      let updatedStatus = '';
      let successMessage = '';
      
      switch (action) {
        case 'activate':
          endpoint = `/api/jobs/${jobId}/activate/`;
          updatedStatus = 'active';
          successMessage = 'Job activated successfully';
          break;
        case 'pause':
          endpoint = `/api/jobs/${jobId}/pause/`;
          updatedStatus = 'paused';
          successMessage = 'Job paused successfully';
          break;
        case 'close':
          endpoint = `/api/jobs/${jobId}/close/`;
          updatedStatus = 'closed';
          successMessage = 'Job closed successfully';
          break;
        case 'delete':
          endpoint = `/api/jobs/${jobId}/`;
          // No status update needed for delete
          successMessage = 'Job deleted successfully';
          break;
        default:
          throw new Error('Invalid action');
      }
      
      if (action === 'delete') {
        await axios.delete(endpoint);
        // Remove the job from state
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      } else {
        const response = await axios.patch(endpoint, { status: updatedStatus });
        // Update the job in state
        setJobs(prevJobs => prevJobs.map(job => 
          job.id === jobId ? { ...job, status: updatedStatus } : job
        ));
      }
      
      // Refresh the categorized job lists
      const updatedJobs = jobs.filter(job => job.id !== jobId || action !== 'delete');
      setActiveJobs(updatedJobs.filter(job => job.status === 'active'));
      setPausedJobs(updatedJobs.filter(job => job.status === 'paused'));
      setDraftJobs(updatedJobs.filter(job => job.status === 'draft'));
      setClosedJobs(updatedJobs.filter(job => job.status === 'closed'));
      
      toast.success(successMessage);
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      toast.error(`Failed to ${action} job. Please try again.`);
    } finally {
      // Close the dialog
      setConfirmDialog({ open: false, jobId: null, action: null });
      setAnchorEl(null);
    }
  };
  
  const handleMenuOpen = (event, jobId) => {
    setAnchorEl(event.currentTarget);
    setSelectedJobId(jobId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJobId(null);
  };
  
  const openConfirmDialog = (action) => {
    setConfirmDialog({ 
      open: true, 
      jobId: selectedJobId, 
      action: action 
    });
    handleMenuClose();
  };
  
  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, jobId: null, action: null });
  };
  
  const getActionText = (action) => {
    switch (action) {
      case 'activate': return 'activate';
      case 'pause': return 'pause';
      case 'close': return 'close';
      case 'delete': return 'delete';
      default: return 'update';
    }
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Dashboard statistics 
  const totalJobs = jobs.length;
  const totalApplications = recentApplications.length;
  const activeJobsCount = activeJobs.length;
  const pendingApplicationsCount = recentApplications.filter(app => app.status === 'pending').length;
  
  // Render job card for job listings
  const renderJobCard = (job) => (
    <Grid item xs={12} sm={6} md={4} key={job.id}>
      <StyledCard>
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
            {job.description.substring(0, 100)}...
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Budget:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {job.currency} {job.budget}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Duration:</Typography>
            <Typography variant="body2">
              {job.duration} days
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
        
        <CardContent>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            View Details
          </Button>
        </CardContent>
      </StyledCard>
    </Grid>
  );
  
  // Render application list item
  const renderApplicationItem = (application) => (
    <ListItem 
      key={application.id}
      secondaryAction={
        <Box>
          <IconButton 
            edge="end" 
            aria-label="approve"
            onClick={() => navigate(`/applications/${application.id}`)}
          >
            <VisibilityIcon />
          </IconButton>
        </Box>
      }
      divider
    >
      <ListItemAvatar>
        <Avatar>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={application.applicant_name}
        secondary={
          <>
            <Typography component="span" variant="body2" color="text.primary">
              Applied for: {application.job_title}
            </Typography>
            <br />
            {formatDate(application.applied_at)}
          </>
        }
      />
      <Chip 
        label={application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        color={application.status === 'accepted' ? 'success' : application.status === 'rejected' ? 'error' : 'default'}
        size="small"
        sx={{ mr: 2 }}
      />
    </ListItem>
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
          startIcon={<RefreshIcon />}
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
          Client Dashboard
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/jobs/create')}
            sx={{ mr: 2 }}
          >
            Post New Job
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
              {totalJobs}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Jobs
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <PlayArrowIcon fontSize="large" color="success" sx={{ mb: 1 }} />
            <Typography variant="h5" component="div">
              {activeJobsCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Jobs
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <PersonIcon fontSize="large" color="info" sx={{ mb: 1 }} />
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
            <HowToRegIcon fontSize="large" color="warning" sx={{ mb: 1 }} />
            <Typography variant="h5" component="div">
              {pendingApplicationsCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Applications
            </Typography>
          </StatCard>
        </Grid>
      </Grid>
      
      {/* Tab Navigation */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <StyledTabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="dashboard tabs"
          >
            <StyledTab label="Active Jobs" />
            <StyledTab label="Draft Jobs" />
            <StyledTab label="Paused Jobs" />
            <StyledTab label="Closed Jobs" />
            <StyledTab label="Recent Applications" />
            <StyledTab label="Company Profile" />
          </StyledTabs>
        </Box>
        
        {/* Tab Panels */}
        
        {/* Active Jobs */}
        {tabValue === 0 && (
          <Box sx={{ mt: 3 }}>
            {activeJobs.length > 0 ? (
              <Grid container spacing={3}>
                {activeJobs.map(job => renderJobCard(job))}
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  You don't have any active jobs yet.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/jobs/create')}
                >
                  Post a New Job
                </Button>
              </Paper>
            )}
          </Box>
        )}
        
        {/* Draft Jobs */}
        {tabValue === 1 && (
          <Box sx={{ mt: 3 }}>
            {draftJobs.length > 0 ? (
              <Grid container spacing={3}>
                {draftJobs.map(job => renderJobCard(job))}
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  You don't have any draft jobs.
                </Typography>
              </Paper>
            )}
          </Box>
        )}
        
        {/* Paused Jobs */}
        {tabValue === 2 && (
          <Box sx={{ mt: 3 }}>
            {pausedJobs.length > 0 ? (
              <Grid container spacing={3}>
                {pausedJobs.map(job => renderJobCard(job))}
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  You don't have any paused jobs.
                </Typography>
              </Paper>
            )}
          </Box>
        )}
        
        {/* Closed Jobs */}
        {tabValue === 3 && (
          <Box sx={{ mt: 3 }}>
            {closedJobs.length > 0 ? (
              <Grid container spacing={3}>
                {closedJobs.map(job => renderJobCard(job))}
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  You don't have any closed jobs.
                </Typography>
              </Paper>
            )}
          </Box>
        )}
        
        {/* Recent Applications */}
        {tabValue === 4 && (
          <Box sx={{ mt: 3 }}>
            {recentApplications.length > 0 ? (
              <Paper>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {recentApplications.map(application => renderApplicationItem(application))}
                </List>
                {recentApplications.length > 5 && (
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Button variant="text" onClick={() => navigate('/applications')}>
                      View All Applications
                    </Button>
                  </Box>
                )}
              </Paper>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  You haven't received any applications yet.
                </Typography>
              </Paper>
            )}
          </Box>
        )}
        
        {/* Company Profile */}
        {tabValue === 5 && (
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ p: 3 }}>
              {companyProfile ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      sx={{ width: 100, height: 100, mr: 3 }}
                      src={companyProfile.logo || ''}
                    >
                      <BusinessIcon fontSize="large" />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" component="h2">
                        {companyProfile.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {companyProfile.industry}
                      </Typography>
                      <Typography variant="body2">
                        {companyProfile.location}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => navigate('/company/profile/edit')}
                      >
                        Edit Profile
                      </Button>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" gutterBottom>
                    Company Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {companyProfile.description || 'No company description provided.'}
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
                        Company Details
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Website:</Typography>
                        <Typography variant="body2">
                          {companyProfile.website || 'Not provided'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Founded:</Typography>
                        <Typography variant="body2">
                          {companyProfile.founded_year || 'Not provided'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Company Size:</Typography>
                        <Typography variant="body2">
                          {companyProfile.company_size || 'Not provided'}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
                        Contact Information
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Email:</Typography>
                        <Typography variant="body2">
                          {companyProfile.email || 'Not provided'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Phone:</Typography>
                        <Typography variant="body2">
                          {companyProfile.phone || 'Not provided'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Address:</Typography>
                        <Typography variant="body2">
                          {companyProfile.address || 'Not provided'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body1" paragraph>
                    You haven't set up your company profile yet.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/company/profile/create')}
                  >
                    Create Company Profile
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
        )}
      </Box>
      
      {/* Job Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedJobId && jobs.find(job => job.id === selectedJobId)?.status === 'active' && (
          <MenuItem onClick={() => openConfirmDialog('pause')}>
            <PauseIcon fontSize="small" sx={{ mr: 1 }} />
            Pause Job
          </MenuItem>
        )}
        {selectedJobId && jobs.find(job => job.id === selectedJobId)?.status === 'paused' && (
          <MenuItem onClick={() => openConfirmDialog('activate')}>
            <PlayArrowIcon fontSize="small" sx={{ mr: 1 }} />
            Activate Job
          </MenuItem>
        )}
        {selectedJobId && jobs.find(job => job.id === selectedJobId)?.status === 'draft' && (
          <MenuItem onClick={() => openConfirmDialog('activate')}>
            <PlayArrowIcon fontSize="small" sx={{ mr: 1 }} />
            Publish Job
          </MenuItem>
        )}
        {selectedJobId && ['active', 'paused'].includes(jobs.find(job => job.id === selectedJobId)?.status) && (
          <MenuItem onClick={() => openConfirmDialog('close')}>
            <VisibilityOffIcon fontSize="small" sx={{ mr: 1 }} />
            Close Job
          </MenuItem>
        )}
        <MenuItem onClick={() => navigate(`/jobs/${selectedJobId}/edit`)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Job
        </MenuItem>
        <MenuItem onClick={() => openConfirmDialog('delete')} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Job
        </MenuItem>
      </Menu>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to ${getActionText(confirmDialog.action)} this job?`}
        </DialogTitle>
        <DialogContent>
          {confirmDialog.action === 'delete' ? (
            <Typography>
              This action cannot be undone. The job and all related data will be permanently deleted.
            </Typography>
          ) : (
            <Typography>
              The job status will be updated to {getActionText(confirmDialog.action)}d.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Cancel</Button>
          <Button 
            onClick={() => handleJobAction(confirmDialog.jobId, confirmDialog.action)}
            color={confirmDialog.action === 'delete' ? 'error' : 'primary'}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClientDashboard;