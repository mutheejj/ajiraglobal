import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, TextField, MenuItem, Chip, Card, CardContent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import axios from 'axios';
import { styled } from '@mui/material/styles';

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
  budget_min: '',
  budget_max: '',
  duration: '',
  location: '',
  remote_work: false,
  status: 'draft',
  preferred_timezone: '',
  attachments: [],
  visibility: 'public',
  application_deadline: '',
  payment_type: 'fixed',
  interview_required: false
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
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    draftJobs: 0,
    closedJobs: 0
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [jobForm, setJobForm] = useState(initialJobForm);
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs/');
      setJobs(response.data);
      
      // Calculate stats
      const jobStats = response.data.reduce((acc, job) => {
        acc.totalJobs++;
        acc[`${job.status}Jobs`]++;
        return acc;
      }, { totalJobs: 0, activeJobs: 0, draftJobs: 0, closedJobs: 0 });
      
      setStats(jobStats);
    } catch (error) {
      console.error('Error fetching jobs:', error);
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
    if (jobForm.payment_type === 'fixed') {
      if (!jobForm.budget_min || !jobForm.budget_max) {
        setError('Please specify budget range');
        return;
      }
      if (Number(jobForm.budget_min) > Number(jobForm.budget_max)) {
        setError('Minimum budget cannot be greater than maximum budget');
        return;
      }
    }
    if (!jobForm.duration) {
      setError('Please specify project duration');
      return;
    }
    
    try {
      const formData = new FormData();
      
      // Append all job data
      Object.keys(jobForm).forEach(key => {
        if (key === 'attachments') {
          jobForm.attachments.forEach(file => {
            formData.append('attachments', file);
          });
        } else if (key === 'skills') {
          formData.append('skills', JSON.stringify(jobForm.skills));
        } else {
          formData.append(key, jobForm[key]);
        }
      });
      
      formData.append('status', 'active');
      
      await axios.post('/api/jobs/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
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
      await axios.post('/api/jobs/', jobData);
      handleDialogClose();
      fetchJobs();
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await axios.post(`/api/jobs/${jobId}/change_status/`, { status: newStatus });
      fetchJobs();
    } catch (error) {
      console.error('Error changing job status:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Posted Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.category}</TableCell>
                <TableCell>
                  <Chip
                    label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    color={job.status === 'active' ? 'success' : job.status === 'draft' ? 'default' : 'error'}
                  />
                </TableCell>
                <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleStatusChange(job.id, job.status === 'active' ? 'closed' : 'active')}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
      <DialogTitle>Post a New Job</DialogTitle>
      <DialogContent>
          {error && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}
          {successMessage && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography color="success.main">{successMessage}</Typography>
            </Box>
          )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StyledPaper component="form" onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom>
                Job Details
              </Typography>

        <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Job Title"
                  name="title"
                  value={jobForm.title}
                  onChange={handleFormChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={jobForm.category}
                  onChange={handleFormChange}
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
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Job Description"
                  name="description"
                  value={jobForm.description}
                  onChange={handleFormChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Payment Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="Payment Type"
                      name="payment_type"
                      value={jobForm.payment_type}
                      onChange={handleFormChange}
                    >
                      <MenuItem value="fixed">Fixed Price</MenuItem>
                      <MenuItem value="hourly">Hourly Rate</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      fullWidth
                      label="Minimum Budget ($)"
                      name="budget_min"
                      type="number"
                      value={jobForm.budget_min}
                      onChange={handleFormChange}
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      fullWidth
                      label="Maximum Budget ($)"
                      name="budget_max"
                      type="number"
                      value={jobForm.budget_max}
                      onChange={handleFormChange}
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Project Timeline
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Duration (in days)"
                      name="duration"
                      type="number"
                      value={jobForm.duration}
                      onChange={handleFormChange}
                      InputProps={{
                        inputProps: { min: 1 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      type="date"
                      label="Application Deadline"
                      name="application_deadline"
                      value={jobForm.application_deadline}
                      onChange={handleFormChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Required Skills
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add Skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                    helperText="Press Enter to add a skill"
                    InputProps={{
                      endAdornment: (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSkillAdd}
                          disabled={!skillInput.trim()}
                        >
                          Add
                        </Button>
                      ),
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {jobForm.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() => handleSkillDelete(skill)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
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

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Project Requirements
                </Typography>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Project Requirements"
                  name="requirements"
                  value={jobForm.requirements}
                  onChange={handleFormChange}
                  helperText="Specify the detailed requirements and qualifications needed for this project"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Project Type"
                  name="project_type"
                  value={jobForm.project_type}
                  onChange={handleFormChange}
                >
                  <MenuItem value="one-time">One-time Project</MenuItem>
                  <MenuItem value="ongoing">Ongoing Project</MenuItem>
                  <MenuItem value="complex">Complex Project</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={jobForm.interview_required}
                      onChange={(e) => setJobForm(prev => ({
                        ...prev,
                        interview_required: e.target.checked
                      }))}
                      name="interview_required"
                    />
                  }
                  label="Require Interview"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Preferred Timezone"
                  name="preferred_timezone"
                  value={jobForm.preferred_timezone}
                  onChange={handleFormChange}
                >
                  <MenuItem value="EAT">East Africa Time (EAT)</MenuItem>
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="flexible">Flexible</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Job Visibility"
                  name="visibility"
                  value={jobForm.visibility}
                  onChange={handleFormChange}
                  helperText="Control who can see and apply to your job"
                >
                  <MenuItem value="public">Public - Visible to all</MenuItem>
                  <MenuItem value="private">Private - Invite only</MenuItem>
                  <MenuItem value="featured">Featured - Promoted listing</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setJobForm(prev => ({
                    ...prev,
                    attachments: Array.from(e.target.files)
                  }))}
                  style={{ display: 'none' }}
                  id="job-attachments"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                />
                <label htmlFor="job-attachments">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<AddIcon />}
                  >
                    Add Attachments
                  </Button>
                </label>
                {jobForm.attachments.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {jobForm.attachments.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => setJobForm(prev => ({
                          ...prev,
                          attachments: prev.attachments.filter((_, i) => i !== index)
                        }))}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Post Job
                </Button>
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Tips for a Great Job Post
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" sx={{ mb: 1 }}>
                Be specific about project requirements
              </Typography>
              <Typography component="li" sx={{ mb: 1 }}>
                Set clear expectations for deliverables
              </Typography>
              <Typography component="li" sx={{ mb: 1 }}>
                Define your budget range realistically
              </Typography>
              <Typography component="li" sx={{ mb: 1 }}>
                List all required skills and experience
              </Typography>
              <Typography component="li" sx={{ mb: 1 }}>
                Provide context about your project
              </Typography>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button onClick={handleSaveAsDraft}>Save as Draft</Button>
        <Button variant="contained" onClick={handleSubmit}>Post Job</Button>
      </DialogActions>
    </Dialog>
    </Container>
  );
};

export default ClientDashboard;