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
    company_name: '',
    industry: '',
    company_size: '',
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
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axios.get('/api/company/profile/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = response.data;
      setCompanyProfile({
        company_name: userData.company_name || '',
        industry: userData.industry || '',
        company_size: userData.company_size || '',
        location: userData.location || '',
        description: userData.description || '',
        website: userData.website || '',
        logo: userData.logo || null
      });
      setError('');
    } catch (error) {
      const errorMessage = error.response?.status === 401 
        ? 'Session expired. Please login again.'
        : error.message || 'Failed to fetch company profile';
      setError(errorMessage);
      console.error('Error fetching company profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
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
      const formData = new FormData();
Object.entries(companyProfile).forEach(([key, value]) => formData.append(key, value));
await axios.put('/api/company/profile/', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEditProfile(false);
      setSuccessMessage('Company profile updated successfully');
      await fetchCompanyProfile();
      setError('');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to update company profile';
      setError(errorMessage);
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
    setLoading(true);
    
    // Basic validation
    if (!jobForm.title.trim()) {
      setError('Job title is required');
      setLoading(false);
      return;
    }
    if (!jobForm.category) {
      setError('Please select a category');
      setLoading(false);
      return;
    }
    if (!jobForm.description.trim()) {
      setError('Job description is required');
      setLoading(false);
      return;
    }
    if (!jobForm.budget || Number(jobForm.budget) <= 0) {
      setError('Please specify a valid budget');
      setLoading(false);
      return;
    }
    if (!jobForm.duration) {
      setError('Please specify project duration');
      setLoading(false);
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setSuccessMessage('Job posted successfully!');
      handleDialogClose();
      await fetchJobs();
    } catch (error) {
      console.error('Error posting job:', error);
      setError(error.response?.data?.detail || 'Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      setLoading(true);
      const jobData = {
        ...jobForm,
        status: 'draft'
      };
      const token = localStorage.getItem('token');
      await axios.post('/api/jobs/', jobData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSuccessMessage('Job saved as draft successfully!');
      handleDialogClose();
      await fetchJobs();
    } catch (error) {
      console.error('Error saving draft:', error);
      setError(error.response?.data?.detail || 'Failed to save job as draft');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.patch(`/api/jobs/${jobId}/`, { status: newStatus }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSuccessMessage(`Job status updated to ${newStatus} successfully`);
      await fetchJobs();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to update job status';
      setError(errorMessage);
      console.error('Error changing job status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Company Profile Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Company Profile</Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditProfile(!editProfile)}
          >
            {editProfile ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>

        {editProfile ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={companyProfile.company_name}
                onChange={(e) => setCompanyProfile(prev => ({ ...prev, company_name: e.target.value }))}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Industry"
                value={companyProfile.industry}
                onChange={(e) => setCompanyProfile(prev => ({ ...prev, industry: e.target.value }))}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Company Size"
                value={companyProfile.company_size}
                onChange={(e) => setCompanyProfile(prev => ({ ...prev, company_size: e.target.value }))}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={companyProfile.location}
                onChange={(e) => setCompanyProfile(prev => ({ ...prev, location: e.target.value }))}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Website"
                value={companyProfile.website}
                onChange={(e) => setCompanyProfile(prev => ({ ...prev, website: e.target.value }))}
                margin="normal"
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Company Description"
                value={companyProfile.description}
                onChange={(e) => setCompanyProfile(prev => ({ ...prev, description: e.target.value }))}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleProfileUpdate}
                disabled={loading}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">Company Name</Typography>
              <Typography variant="body1" paragraph>{companyProfile.company_name || 'Not specified'}</Typography>

              <Typography variant="subtitle1" color="text.secondary">Industry</Typography>
              <Typography variant="body1" paragraph>{companyProfile.industry || 'Not specified'}</Typography>

              <Typography variant="subtitle1" color="text.secondary">Company Size</Typography>
              <Typography variant="body1" paragraph>{companyProfile.company_size || 'Not specified'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">Location</Typography>
              <Typography variant="body1" paragraph>{companyProfile.location || 'Not specified'}</Typography>

              <Typography variant="subtitle1" color="text.secondary">Website</Typography>
              <Typography variant="body1" paragraph>
                {companyProfile.website ? (
                  <a href={companyProfile.website} target="_blank" rel="noopener noreferrer">
                    {companyProfile.website}
                  </a>
                ) : 'Not specified'}
              </Typography>

              <Typography variant="subtitle1" color="text.secondary">Description</Typography>
              <Typography variant="body1" paragraph>{companyProfile.description || 'Not specified'}</Typography>
            </Grid>
          </Grid>
        )}
      </Paper>
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

      {/* Job Creation Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Post New Job</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Job Title"
                name="title"
                value={jobForm.title}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Category"
                name="category"
                value={jobForm.category}
                onChange={handleFormChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Job Description"
                name="description"
                value={jobForm.description}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Requirements"
                name="requirements"
                value={jobForm.requirements}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSkillAdd();
                  }
                }}
                helperText="Press Enter to add a skill"
              />
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {jobForm.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleSkillDelete(skill)}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Experience Level"
                name="experience_level"
                value={jobForm.experience_level}
                onChange={handleFormChange}
              >
                <MenuItem value="entry">Entry Level</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Project Type"
                name="project_type"
                value={jobForm.project_type}
                onChange={handleFormChange}
              >
                <MenuItem value="full_time">Full Time</MenuItem>
                <MenuItem value="part_time">Part Time</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                <MenuItem value="freelance">Freelance</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Budget"
                name="budget"
                value={jobForm.budget}
                onChange={handleFormChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TextField
                        select
                        value={jobForm.currency}
                        onChange={(e) => setJobForm(prev => ({ ...prev, currency: e.target.value }))}
                        variant="standard"
                        sx={{ width: '70px' }}
                      >
                        <MenuItem value="KSH">KSH</MenuItem>
                        <MenuItem value="USD">USD</MenuItem>
                      </TextField>
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (days)"
                name="duration"
                value={jobForm.duration}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={jobForm.location}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={jobForm.remote_work}
                    onChange={(e) => setJobForm(prev => ({ ...prev, remote_work: e.target.checked }))}
                    name="remote_work"
                  />
                }
                label="Remote Work Available"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleSaveAsDraft}
            disabled={loading}
            variant="outlined"
          >
            Save as Draft
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant="contained"
          >
            Post Job
          </Button>
        </DialogActions>
      </Dialog>

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