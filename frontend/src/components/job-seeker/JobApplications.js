import React from 'react';
import { Box, Typography, Paper, Stepper, Step, StepLabel, Chip, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import BusinessIcon from '@mui/icons-material/Business';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
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
  }[status] || theme.palette.grey[300],
  color: {
    pending: theme.palette.warning.dark,
    reviewing: theme.palette.info.dark,
    interviewed: theme.palette.success.dark,
    rejected: theme.palette.error.dark,
  }[status] || theme.palette.grey[700],
}));

const applications = [
  {
    id: 1,
    position: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    location: 'Remote',
    appliedDate: '2024-03-15',
    status: 'interviewed',
    steps: ['Applied', 'Resume Reviewed', 'Technical Interview', 'Final Interview'],
    currentStep: 2,
  },
  {
    id: 2,
    position: 'Full Stack Engineer',
    company: 'Innovation Labs',
    location: 'New York, NY',
    appliedDate: '2024-03-10',
    status: 'reviewing',
    steps: ['Applied', 'Resume Reviewed', 'Technical Interview'],
    currentStep: 1,
  },
  {
    id: 3,
    position: 'Backend Developer',
    company: 'Data Systems Co.',
    location: 'San Francisco, CA',
    appliedDate: '2024-03-05',
    status: 'pending',
    steps: ['Applied', 'Resume Review', 'Technical Interview'],
    currentStep: 0,
  },
];

const JobApplications = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Job Applications
      </Typography>
      {applications.map((application) => (
        <StyledPaper key={application.id}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {application.position}
              </Typography>
              <ApplicationInfo>
                <BusinessIcon fontSize="small" />
                <Typography variant="body2">{application.company}</Typography>
              </ApplicationInfo>
              <ApplicationInfo>
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">{application.location}</Typography>
              </ApplicationInfo>
              <ApplicationInfo>
                <DateRangeIcon fontSize="small" />
                <Typography variant="body2">Applied on {application.appliedDate}</Typography>
              </ApplicationInfo>
            </Box>
            <StatusChip
              label={application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              status={application.status}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Stepper activeStep={application.currentStep} alternativeLabel>
            {application.steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </StyledPaper>
      ))}
    </Box>
  );
};

export default JobApplications;