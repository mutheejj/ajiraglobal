import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  Chip,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BusinessIcon from '@mui/icons-material/Business';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import TimerIcon from '@mui/icons-material/Timer';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1)
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
  }[status] || theme.palette.grey[700]
}));

const JobApplicationDetails = ({ application, onWithdraw }) => {
  if (!application) return null;

  const handleWithdraw = () => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      onWithdraw(application.id);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <StyledPaper>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">{application.job.title}</Typography>
              <StatusChip
                label={application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                status={application.status}
              />
            </Box>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Company Details</Typography>
            <InfoItem>
              <BusinessIcon />
              <Typography>{application.job.client_company}</Typography>
            </InfoItem>
            <InfoItem>
              <LocationOnIcon />
              <Typography>{application.job.location}</Typography>
            </InfoItem>
            <InfoItem>
              <AttachMoneyIcon />
              <Typography>
                {application.job.budget} {application.job.currency} 
                {application.job.project_type === 'fixed' ? '(Fixed Price)' : '(Per Hour)'}
              </Typography>
            </InfoItem>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Application Details</Typography>
            <InfoItem>
              <DateRangeIcon />
              <Typography>Applied on: {new Date(application.applied_date).toLocaleDateString()}</Typography>
            </InfoItem>
            <InfoItem>
              <WorkIcon />
              <Typography>Experience Required: {application.job.experience_level}</Typography>
            </InfoItem>
            <InfoItem>
              <TimerIcon />
              <Typography>Duration: {application.job.duration} months</Typography>
            </InfoItem>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Application Progress</Typography>
            <Box sx={{ mt: 2, mb: 4 }}>
              <Stepper activeStep={application.current_step} alternativeLabel>
                {application.steps.map((label, index) => (
                  <Step key={index}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Job Description</Typography>
            <Typography variant="body1" paragraph>
              {application.job.description}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Required Skills</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {application.job.skills.map((skill, index) => (
                <Chip key={index} label={skill} variant="outlined" />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                href={`/jobs/${application.job.id}`}
              >
                View Job Post
              </Button>
              {application.status === 'pending' && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleWithdraw}
                >
                  Withdraw Application
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>
    </Box>
  );
};

export default JobApplicationDetails;