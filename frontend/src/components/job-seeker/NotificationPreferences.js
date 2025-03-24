import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    jobAlerts: true,
    matchingJobs: true,
    applicationUpdates: true,
    weeklyDigest: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSave = () => {
    // TODO: Implement API call to save preferences
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Notification Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Choose which notifications you'd like to receive
      </Typography>

      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.jobAlerts}
              onChange={handleChange}
              name="jobAlerts"
              color="primary"
            />
          }
          label="New Job Alerts"
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
          Receive notifications when new jobs matching your skills are posted
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={preferences.matchingJobs}
              onChange={handleChange}
              name="matchingJobs"
              color="primary"
            />
          }
          label="Matching Job Recommendations"
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
          Get personalized job recommendations based on your profile
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={preferences.applicationUpdates}
              onChange={handleChange}
              name="applicationUpdates"
              color="primary"
            />
          }
          label="Application Status Updates"
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
          Stay informed about your job application status changes
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={preferences.weeklyDigest}
              onChange={handleChange}
              name="weeklyDigest"
              color="primary"
            />
          }
          label="Weekly Job Digest"
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
          Receive a weekly summary of the best job matches
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          Save Preferences
        </Button>

        {saved && (
          <Alert severity="success" sx={{ ml: 2 }}>
            Preferences saved successfully!
          </Alert>
        )}
      </Box>
    </StyledPaper>
  );
};

export default NotificationPreferences;