import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BusinessIcon from '@mui/icons-material/Business';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import TimerIcon from '@mui/icons-material/Timer';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useJobSeeker } from '../context/JobSeekerContext';
import JobAPI from '../services/JobAPI';

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

const JobDetails = ({ job, onClose }) => {
  const { savedJobs, saveJob, removeJob, applyForJob } = useJobSeeker();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isJobSaved = savedJobs?.some(savedJob => savedJob.id === job.id);

  const handleSaveJob = async () => {
    try {
      if (isJobSaved) {
        await removeJob(job.id);
        setSuccess('Job removed from saved jobs');
      } else {
        await saveJob(job.id);
        setSuccess('Job saved successfully');
      }
    } catch (err) {
      setError(err.message || 'Failed to save job');
    }
  };

  const handleApply = async () => {
    setLoading(true);
    setError(null);
    try {
      await applyForJob(job.id);
      setSuccess('Application submitted successfully');
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <StyledPaper>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">{job.title}</Typography>
              <Button
                onClick={handleSaveJob}
                startIcon={isJobSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                color={isJobSaved ? 'primary' : 'inherit'}
              >
                {isJobSaved ? 'Saved' : 'Save Job'}
              </Button>
            </Box>
            {(error || success) && (
              <Alert 
                severity={error ? 'error' : 'success'} 
                onClose={() => {
                  setError(null);
                  setSuccess(null);
                }}
                sx={{ mb: 2 }}
              >
                {error || success}
              </Alert>
            )}
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Company Details</Typography>
            <InfoItem>
              <BusinessIcon />
              <Typography>{job.company_name}</Typography>
            </InfoItem>
            <InfoItem>
              <LocationOnIcon />
              <Typography>{job.location}</Typography>
            </InfoItem>
            <InfoItem>
              <AttachMoneyIcon />
              <Typography>
                {job.currency} {job.salary_min} - {job.salary_max}
              </Typography>
            </InfoItem>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Job Details</Typography>
            <InfoItem>
              <DateRangeIcon />
              <Typography>Posted: {job.time_ago}</Typography>
            </InfoItem>
            <InfoItem>
              <WorkIcon />
              <Typography>Experience: {job.experience_level || 'Not specified'}</Typography>
            </InfoItem>
            <InfoItem>
              <TimerIcon />
              <Typography>Duration: {job.duration || 'Not specified'}</Typography>
            </InfoItem>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Job Description</Typography>
            <Typography variant="body1" paragraph>
              {job.description}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Required Skills</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {job.category && (
                <Chip
                  icon={<WorkIcon />}
                  label={job.category}
                  color="primary"
                  variant="outlined"
                />
              )}
              {job.skills?.map((skill, index) => (
                <Chip key={index} label={skill} variant="outlined" />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={onClose}
              >
                Back to Jobs
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApply}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Apply Now'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>
    </Box>
  );
};

export default JobDetails;