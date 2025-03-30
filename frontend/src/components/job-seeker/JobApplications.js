import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BusinessIcon from '@mui/icons-material/Business';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import JobApplicationDetails from './JobApplicationDetails';
import { useJobSeeker } from '../../context/JobSeekerContext';
import JobAPI from '../../services/JobAPI';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease',
  },
}));

const ApplicationInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: {
    pending: theme.palette.warning.light,
    reviewing: theme.palette.info.light,
    interviewed: theme.palette.success.light,
    rejected: theme.palette.error.light,
    accepted: theme.palette.success.light
  }[status] || theme.palette.grey[300],
  color: {
    pending: theme.palette.warning.dark,
    reviewing: theme.palette.info.dark,
    interviewed: theme.palette.success.dark,
    rejected: theme.palette.error.dark,
    accepted: theme.palette.success.dark
  }[status] || theme.palette.grey[700],
}));

const JobApplications = () => {
  const { applications, applicationsLoading, refreshApplications } = useJobSeeker();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

  const handleStatusChange = (event, newValue) => {
    setSelectedStatus(newValue);
    setSelectedApplication(null);
  };

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
  };

  const handleWithdraw = async (applicationId) => {
    try {
      await JobAPI.withdrawApplication(applicationId);
      refreshApplications();
      setSelectedApplication(null);
    } catch (error) {
      setError('Failed to withdraw application. Please try again.');
    }
  };

  const filteredApplications = (!applications ? [] : Array.isArray(applications) ? applications : []).filter(app => 
    app && (selectedStatus === 'all' ? true : app.status === selectedStatus)
  );

  if (selectedApplication) {
    return (
      <JobApplicationDetails
        application={selectedApplication}
        onWithdraw={handleWithdraw}
      />
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Job Applications
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Tabs
        value={selectedStatus}
        onChange={handleStatusChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab value="all" label="All" />
        <Tab value="pending" label="Pending" />
        <Tab value="reviewing" label="Reviewing" />
        <Tab value="interviewed" label="Interviewed" />
        <Tab value="accepted" label="Accepted" />
        <Tab value="rejected" label="Rejected" />
      </Tabs>

      {applicationsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredApplications.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No applications found for this status.
        </Typography>
      ) : (
        filteredApplications.map((application) => (
          <StyledPaper
            key={application.id}
            onClick={() => handleApplicationClick(application)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {application.job.title}
                </Typography>
                <ApplicationInfo>
                  <BusinessIcon fontSize="small" />
                  <Typography variant="body2">{application.job.client_company}</Typography>
                </ApplicationInfo>
                <ApplicationInfo>
                  <LocationOnIcon fontSize="small" />
                  <Typography variant="body2">{application.job.location}</Typography>
                </ApplicationInfo>
                <ApplicationInfo>
                  <DateRangeIcon fontSize="small" />
                  <Typography variant="body2">
                    Applied on {new Date(application.applied_date).toLocaleDateString()}
                  </Typography>
                </ApplicationInfo>
              </Box>
              <StatusChip
                label={application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                status={application.status}
              />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Stepper activeStep={application.current_step} alternativeLabel>
              {application.steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </StyledPaper>
        ))
      )}
    </Box>
  );
};

export default JobApplications;