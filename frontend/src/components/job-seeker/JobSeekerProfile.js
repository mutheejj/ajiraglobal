import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Chip,
  Avatar,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useJobSeeker } from '../../context/JobSeekerContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
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

const SocialLink = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const JobSeekerProfile = () => {
  const { profile, loading, error, updateProfile, refreshProfile } = useJobSeeker();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    profession: '',
    hourly_rate: '',
    currency: 'KSH',
    availability: 'Full-time',
    bio: '',
    github_link: '',
    linkedin_link: '',
    personal_website: '',
    portfolio_description: '',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({ success: false, message: '' });

  useEffect(() => {
    if (profile) {
      // Convert skills string to array if needed
      const skillsArray = profile.skills ? 
        (Array.isArray(profile.skills) ? profile.skills : profile.skills.split(',').map(s => s.trim())) : 
        [];
      
      setFormData(prev => ({
        ...prev,
        ...profile,
        skills: skillsArray,
      }));
    }
  }, [profile]);

  // Ensure profile data is loaded when component mounts
  useEffect(() => {
    refreshProfile();
  }, []); // Only run once on mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillAdd = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleSkillDelete = (skillToDelete) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToDelete)
    }));
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'skills') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedImage) {
        formDataToSend.append('profile_picture', selectedImage);
      }

      const success = await updateProfile(formDataToSend);
      if (success) {
        setUpdateStatus({
          success: true,
          message: 'Profile updated successfully!'
        });
        if (previewImage) {
          URL.revokeObjectURL(previewImage);
          setPreviewImage(null);
        }
        setSelectedImage(null);
      }
    } catch (err) {
      setUpdateStatus({
        success: false,
        message: 'Failed to update profile. Please try again.'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <StyledPaper>
          <ProfileSection>
            <Avatar
              src={previewImage || formData.profile_picture}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '3rem',
              }}
            >
              {formData.first_name ? formData.first_name.charAt(0) : ''}
            </Avatar>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-photo-input"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="profile-photo-input">
              <Button variant="outlined" color="primary" component="span">
                {selectedImage ? 'Change Selected Photo' : 'Edit Profile Picture'}
              </Button>
            </label>
          </ProfileSection>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Social Links
            </Typography>
            <SocialLink>
              <LinkedInIcon />
              <TextField
                fullWidth
                name="linkedin_link"
                label="LinkedIn Profile"
                value={formData.linkedin_link}
                onChange={handleInputChange}
                size="small"
              />
            </SocialLink>
            <SocialLink>
              <GitHubIcon />
              <TextField
                fullWidth
                name="github_link"
                label="GitHub Profile"
                value={formData.github_link}
                onChange={handleInputChange}
                size="small"
              />
            </SocialLink>
            <SocialLink>
              <LanguageIcon />
              <TextField
                fullWidth
                name="personal_website"
                label="Personal Website"
                value={formData.personal_website}
                onChange={handleInputChange}
                size="small"
              />
            </SocialLink>
          </Box>
        </StyledPaper>
      </Grid>

      <Grid item xs={12} md={8}>
        <StyledPaper>
          {updateStatus.message && (
            <Alert
              severity={updateStatus.success ? 'success' : 'error'}
              onClose={() => setUpdateStatus({ success: false, message: '' })}
              sx={{ mb: 2 }}
            >
              {updateStatus.message}
            </Alert>
          )}

          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="first_name"
                label="First Name"
                value={formData.first_name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Professional Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="profession"
                label="Professional Title"
                value={formData.profession}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="hourly_rate"
                label="Hourly Rate"
                value={formData.hourly_rate}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="availability"
                label="Availability"
                value={formData.availability}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Skills
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd()}
              />
              <Button variant="contained" onClick={handleSkillAdd}>
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.skills.map((skill, index) => (
                <SkillChip
                  key={index}
                  label={skill}
                  onDelete={() => handleSkillDelete(skill)}
                />
              ))}
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom>
            Bio & Portfolio
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="bio"
                label="Professional Bio"
                value={formData.bio}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="portfolio_description"
                label="Portfolio Description"
                value={formData.portfolio_description}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              size="large"
            >
              Save Changes
            </Button>
          </Box>
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default JobSeekerProfile;