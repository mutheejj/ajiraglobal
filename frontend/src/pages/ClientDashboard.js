import React, { useState } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, TextField, MenuItem, Chip } from '@mui/material';
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const ClientDashboard = () => {
  const [jobForm, setJobForm] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    duration: '',
    skills: [],
    experience_level: '',
    project_type: '',
  });

  const [skillInput, setSkillInput] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement job posting API call
    console.log('Job Form Data:', jobForm);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1" sx={{ mb: 4 }}>
        Post a New Job
      </Typography>

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
    </Container>
  );
};

export default ClientDashboard;