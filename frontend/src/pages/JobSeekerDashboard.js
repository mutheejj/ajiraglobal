import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Paper, TextField, Button, Chip, Avatar, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';

import JobApplications from '../components/job-seeker/JobApplications';
import SavedJobs from '../components/job-seeker/SavedJobs';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

const JobSeekerDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    title: 'Full Stack Developer',
    bio: 'Passionate developer with 5 years of experience in web development...',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB'],
    hourlyRate: '50',
    availability: 'Full-time',
    currency: 'KSH',
    resume: null,
    portfolio: null,
    githubLink: '',
    linkedinLink: '',
    personalWebsite: '',
    portfolioDescription: ''
  });

  const [newSkill, setNewSkill] = useState('');

  const handleSkillAdd = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleSkillDelete = (skillToDelete) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToDelete)
    }));
  };

  const handleProfileUpdate = () => {
    // TODO: Implement profile update API call
    console.log('Updated Profile:', profile);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StyledPaper>
                <ProfileSection>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                      bgcolor: 'primary.main',
                      fontSize: '3rem',
                    }}
                  >
                    {profile.fullName.charAt(0)}
                  </Avatar>
                  <Typography variant="h5" gutterBottom>
                    {profile.fullName}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {profile.title}
                  </Typography>
                  <Button variant="outlined" color="primary">
                    Edit Profile Picture
                  </Button>
                </ProfileSection>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Hourly Rate
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        label="Rate"
                        value={profile.hourlyRate}
                        onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
                        type="number"
                        InputProps={{
                          startAdornment: profile.currency === 'KSH' ? 'KSh' : '$',
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        select
                        value={profile.currency}
                        onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                      >
                        <option value="KSH">KSH</option>
                        <option value="USD">USD</option>
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Availability
                  </Typography>
                  <TextField
                    fullWidth
                    select
                    value={profile.availability}
                    onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </TextField>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Resume Upload
                  </Typography>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setProfile({ ...profile, resume: e.target.files[0] })}
                    style={{ display: 'none' }}
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Upload Resume
                    </Button>
                  </label>
                  {profile.resume && (
                    <Typography variant="body2" color="text.secondary">
                      {profile.resume.name}
                    </Typography>
                  )}
                </Box>
              </StyledPaper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledPaper>
                    <Typography variant="h6" gutterBottom>
                      Professional Bio
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    />
                  </StyledPaper>
                </Grid>

                <Grid item xs={12}>
                  <StyledPaper>
                    <Typography variant="h6" gutterBottom>
                      Skills
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Add Skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {profile.skills.map((skill) => (
                        <SkillChip
                          key={skill}
                          label={skill}
                          onDelete={() => handleSkillDelete(skill)}
                        />
                      ))}
                    </Box>
                  </StyledPaper>
                </Grid>

                <Grid item xs={12}>
                  <StyledPaper>
                    <Typography variant="h6" gutterBottom>
                      Portfolio & Work History
                    </Typography>
                    <input
                      type="file"
                      accept=".pdf,.zip,.rar"
                      onChange={(e) => setProfile({ ...profile, portfolio: e.target.files[0] })}
                      style={{ display: 'none' }}
                      id="portfolio-upload"
                    />
                    <label htmlFor="portfolio-upload">
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        Upload Portfolio
                      </Button>
                    </label>
                    {profile.portfolio && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {profile.portfolio.name}
                      </Typography>
                    )}
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Portfolio Description"
                      value={profile.portfolioDescription}
                      onChange={(e) => setProfile({ ...profile, portfolioDescription: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                  </StyledPaper>
                </Grid>

                <Grid item xs={12}>
                  <StyledPaper>
                    <Typography variant="h6" gutterBottom>
                      Social & Professional Links
                    </Typography>
                    <TextField
                      fullWidth
                      label="GitHub Profile"
                      value={profile.githubLink}
                      onChange={(e) => setProfile({ ...profile, githubLink: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="LinkedIn Profile"
                      value={profile.linkedinLink}
                      onChange={(e) => setProfile({ ...profile, linkedinLink: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Personal Website"
                      value={profile.personalWebsite}
                      onChange={(e) => setProfile({ ...profile, personalWebsite: e.target.value })}
                    />
                  </StyledPaper>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={handleProfileUpdate}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      case 1:
        return <JobApplications />;
      case 2:
        return <SavedJobs />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Profile" />
          <Tab label="Applications" />
          <Tab label="Saved Jobs" />
        </Tabs>
      </Box>
      {renderTabContent()}
      <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <ProfileSection>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                }}
              >
                {profile.fullName.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {profile.fullName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {profile.title}
              </Typography>
              <Button variant="outlined" color="primary">
                Edit Profile Picture
              </Button>
            </ProfileSection>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Hourly Rate
              </Typography>
              <TextField
                fullWidth
                label="Rate (USD)"
                value={profile.hourlyRate}
                onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
                type="number"
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Availability
              </Typography>
              <TextField
                fullWidth
                select
                value={profile.availability}
                onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </TextField>
            </Box>
          </StyledPaper>
        </Grid>

        {/* Main Content Section */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Bio Section */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom>
                  Professional Bio
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </StyledPaper>
            </Grid>

            {/* Skills Section */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom>
                  Skills
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add Skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profile.skills.map((skill) => (
                    <SkillChip
                      key={skill}
                      label={skill}
                      onDelete={() => handleSkillDelete(skill)}
                    />
                  ))}
                </Box>
              </StyledPaper>
            </Grid>

            {/* Portfolio Section */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom>
                  Portfolio & Work History
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Add Portfolio Item
                </Button>
                <Typography variant="body2" color="text.secondary" align="center">
                  Showcase your best work to attract potential clients
                </Typography>
              </StyledPaper>
            </Grid>

            {/* Save Changes */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleProfileUpdate}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default JobSeekerDashboard;