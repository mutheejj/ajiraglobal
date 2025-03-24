import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-4px)',
  },
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const ClientProfile = () => {
  const [profile, setProfile] = useState({
    companyName: 'Tech Solutions Inc.',
    email: 'contact@techsolutions.com',
    phone: '+1 (555) 123-4567',
    industry: 'Information Technology',
    description: 'Leading technology solutions provider with a focus on innovative software development.',
    website: 'www.techsolutions.com',
    location: 'San Francisco, CA',
  });

  const handleProfileUpdate = () => {
    // TODO: Implement profile update API call
    console.log('Updated Profile:', profile);
  };

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
              {profile.companyName.charAt(0)}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {profile.companyName}
            </Typography>
            <Button variant="outlined" color="primary">
              Update Logo
            </Button>
          </ProfileSection>

          <Box>
            <InfoItem>
              <BusinessIcon color="primary" />
              <Typography>{profile.industry}</Typography>
            </InfoItem>
            <InfoItem>
              <EmailIcon color="primary" />
              <Typography>{profile.email}</Typography>
            </InfoItem>
            <InfoItem>
              <PhoneIcon color="primary" />
              <Typography>{profile.phone}</Typography>
            </InfoItem>
          </Box>
        </StyledPaper>
      </Grid>

      <Grid item xs={12} md={8}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Company Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Industry"
                value={profile.industry}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Company Description"
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleProfileUpdate}
            >
              Save Changes
            </Button>
          </Box>
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default ClientProfile;