import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, TextField, MenuItem, Chip, Card, CardContent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch, Avatar, LinearProgress, Divider, Alert, Snackbar, InputAdornment } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, Business as BusinessIcon, People as PeopleIcon, Assessment as AssessmentIcon, Timeline as TimelineIcon } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

const ClientDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    draftJobs: 0,
    closedJobs: 0,
    totalApplications: 0,
    shortlistedCandidates: 0,
    interviewsScheduled: 0,
    offersExtended: 0
  });
  const [companyProfile, setCompanyProfile] = useState({
    name: '',
    industry: '',
    size: '',
    location: '',
    description: '',
    website: '',
    logo: null
  });
  const [editProfile, setEditProfile] = useState(false);
  const [recruitmentSettings, setRecruitmentSettings] = useState({
    autoScreening: false,
    notificationPreferences: {
      email: false,
      inApp: false
    },
    applicationDeadlineDefault: 30,
    autoScreening: false,
    notificationPreferences: {
      email: true,
      inApp: true
    },
    applicationDeadlineDefault: 30,
    interviewStages: ['Initial', 'Technical', 'Final'],
    customFields: []
  });

  // Ensure notificationPreferences is always defined
  const safeNotificationPreferences = recruitmentSettings?.notificationPreferences || { email: false, inApp: false };
  const [editSettings, setEditSettings] = useState(false);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    fetchCompanyProfile();
    fetchRecruitmentSettings();
    fetchRecentApplications();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/company/profile/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCompanyProfile(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch company profile');
      console.error('Error fetching company profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecruitmentSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/company/recruitment-settings/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRecruitmentSettings(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch recruitment settings');
      console.error('Error fetching recruitment settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/company/recent-applications/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRecentApplications(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch recent applications');
      console.error('Error fetching recent applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put('/api/company/profile/', companyProfile, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEditProfile(false);
      setSuccessMessage('Company profile updated successfully');
      setError('');
    } catch (error) {
      setError('Failed to update company profile');
      console.error('Error updating company profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put('/api/company/recruitment-settings/', recruitmentSettings, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEditSettings(false);
      setSuccessMessage('Recruitment settings updated successfully');
      setError('');
    } catch (error) {
      setError('Failed to update recruitment settings');
      console.error('Error updating recruitment settings:', error);
    } finally {
      setLoading(false);
    }
  };
  const [recruitmentMetrics, setRecruitmentMetrics] = useState([
    { name: 'Jan', applications: 65, interviews: 28, offers: 15 },
    { name: 'Feb', applications: 59, interviews: 32, offers: 20 },
    { name: 'Mar', applications: 80, interviews: 41, offers: 25 },
    { name: 'Apr', applications: 81, interviews: 37, offers: 22 },
    { name: 'May', applications: 56, interviews: 31, offers: 18 },
    { name: 'Jun', applications: 55, interviews: 35, offers: 21 }
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [jobForm, setJobForm] = useState(initialJobForm);
  const [skillInput, setSkillInput] = useState('');
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/jobs/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setJobs(response.data);
      
      // Calculate stats
      const jobStats = response.data.reduce((acc, job) => {
        acc.totalJobs++;
        acc[`${job.status}Jobs`] = (acc[`${job.status}Jobs`] || 0) + 1;
        return acc;
      }, { totalJobs: 0, activeJobs: 0, draftJobs: 0, closedJobs: 0 });
      
      setStats(jobStats);
      setError('');
    } catch (error) {
      setError('Failed to fetch jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = () => {
    setJobForm(initialJobForm);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setJobForm(initialJobForm);
    setSkillInput('');
  };



  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setJobForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !jobForm.skills.includes(skillInput.trim())) {
      setJobForm(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleSkillDelete = (skillToDelete) => {
    setJobForm(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToDelete)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!jobForm.title.trim()) {
      setError('Job title is required');
      return;
    }
    if (!jobForm.category) {
      setError('Please select a category');
      return;
    }
    if (!jobForm.description.trim()) {
      setError('Job description is required');
      return;
    }
    if (!jobForm.budget || Number(jobForm.budget) <= 0) {
      setError('Please specify a valid budget');
      return;
    }
    if (!jobForm.duration) {
      setError('Please specify project duration');
      return;
    }
    
    try {
      const jobData = {
        ...jobForm,
        budget: Number(jobForm.budget).toFixed(2),
        skills: Array.isArray(jobForm.skills) ? jobForm.skills : [],
        status: 'active'
      };
      
      const token = localStorage.getItem('token');
      await axios.post('/api/jobs/', jobData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      handleDialogClose();
      fetchJobs();
    } catch (error) {
      console.error('Error posting job:', error);
      setError(error.response?.data?.message || 'Failed to create job. Please try again.');
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      const jobData = {
        ...jobForm,
        status: 'draft'
      };
      const token = localStorage.getItem('token');
      await axios.post('/api/jobs/', jobData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      handleDialogClose();
      fetchJobs();
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/jobs/${jobId}/change_status/`, { status: newStatus }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchJobs();
    } catch (error) {
      console.error('Error changing job status:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Notification System */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Recruitment Metrics Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Recruitment Overview
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{stats.totalApplications}</Typography>
              <Typography color="text.secondary">Total Applications</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <AssessmentIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{stats.shortlistedCandidates}</Typography>
              <Typography color="text.secondary">Shortlisted</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <TimelineIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4">{stats.interviewsScheduled}</Typography>
              <Typography color="text.secondary">Interviews</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <BusinessIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{stats.offersExtended}</Typography>
              <Typography color="text.secondary">Offers Extended</Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>Hiring Progress</Typography>
        <Box sx={{ height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recruitmentMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applications" fill="#8884d8" name="Applications" />
              <Bar dataKey="interviews" fill="#82ca9d" name="Interviews" />
              <Bar dataKey="offers" fill="#ffc658" name="Offers" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Client Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleDialogOpen}
        >
          Post New Job
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            backgroundColor: theme => theme.palette.background.paper,
            boxShadow: theme => theme.shadows[2],
            transition: theme => theme.transitions.create(['box-shadow', 'transform'], {
              duration: theme.transitions.duration.standard,
            }),
            '&:hover': {
              boxShadow: theme => theme.shadows[4],
              transform: 'translateY(-4px)',
            },
          }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Jobs</Typography>
              <Typography variant="h4" color="text.primary">{stats.totalJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            backgroundColor: theme => theme.palette.background.paper,
            boxShadow: theme => theme.shadows[2],
            transition: theme => theme.transitions.create(['box-shadow', 'transform'], {
              duration: theme.transitions.duration.standard,
            }),
            '&:hover': {
              boxShadow: theme => theme.shadows[4],
              transform: 'translateY(-4px)',
            },
          }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Active Jobs</Typography>
              <Typography variant="h4" color="text.primary">{stats.activeJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            backgroundColor: theme => theme.palette.background.paper,
            boxShadow: theme => theme.shadows[2],
            transition: theme => theme.transitions.create(['box-shadow', 'transform'], {
              duration: theme.transitions.duration.standard,
            }),
            '&:hover': {
              boxShadow: theme => theme.shadows[4],
              transform: 'translateY(-4px)',
            },
          }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Draft Jobs</Typography>
              <Typography variant="h4" color="text.primary">{stats.draftJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Closed Jobs</Typography>
              <Typography variant="h4">{stats.closedJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Job Listings Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Active Job Listings</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleDialogOpen}>
            Post New Job
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Applications</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.category}</TableCell>
                  <TableCell>{job.applications_count || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={job.status}
                      color={job.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleStatusChange(job.id, job.status === 'active' ? 'closed' : 'active')}>
                      {job.status === 'active' ? <DeleteIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Settings and Recent Applications Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Recruitment Settings</Typography>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditSettings(!editSettings)}>
            {editSettings ? 'Cancel' : 'Update Settings'}
          </Button>
        </Box>

        {editSettings ? (
          <Box component="form" sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={recruitmentSettings.autoScreening}
                  onChange={(e) => setRecruitmentSettings(prev => ({
                    ...prev,
                    autoScreening: e.target.checked
                  }))}
                />
              }
              label="Enable Auto-Screening"
            />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Notification Preferences</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={safeNotificationPreferences.email}
                  onChange={(e) => setRecruitmentSettings(prev => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      email: e.target.checked
                    }
                  }))}
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={safeNotificationPreferences.inApp}
                  onChange={(e) => setRecruitmentSettings(prev => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      inApp: e.target.checked
                    }
                  }))}
                />
              }
              label="In-App Notifications"
            />
            <TextField
              fullWidth
              type="number"
              label="Default Application Deadline (days)"
              value={recruitmentSettings.applicationDeadlineDefault}
              onChange={(e) => setRecruitmentSettings(prev => ({
                ...prev,
                applicationDeadlineDefault: parseInt(e.target.value) || 0
              }))}
              sx={{ mt: 2 }}
            />
          </Box>
        ) : (
          <Box>
            <Typography variant="body1">
              Auto-Screening: {recruitmentSettings.autoScreening ? 'Enabled' : 'Disabled'}
            </Typography>
            <Typography variant="body1">
              Email Notifications: {recruitmentSettings?.notificationPreferences?.email ? 'Enabled' : 'Disabled'}
            </Typography>
            <Typography variant="body1">
              In-App Notifications: {recruitmentSettings?.notificationPreferences?.inApp ? 'Enabled' : 'Disabled'}
            </Typography>
            <Typography variant="body1">
              Default Application Deadline: {recruitmentSettings.applicationDeadlineDefault} days
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ClientDashboard;