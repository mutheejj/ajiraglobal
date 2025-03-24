import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, TextField, MenuItem, Chip, Card, CardContent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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
  budget: '',
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
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    draftJobs: 0,
    closedJobs: 0
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [jobForm, setJobForm] = useState(initialJobForm);
  const [skillInput, setSkillInput] = useState('');

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
    try {
      const jobData = {
        ...jobForm,
        status: 'active'
      };
      await axios.post('/api/jobs/', jobData);
      handleDialogClose();
      fetchJobs();
    } catch (error) {
      console.error('Error posting job:', error);
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

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Budget ($)"
                  name="budget"
                  type="number"
                  value={jobForm.budget}
                  onChange={handleFormChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Duration (in days)"
                  name="duration"
                  type="number"
                  value={jobForm.duration}
                  onChange={handleFormChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Required Skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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