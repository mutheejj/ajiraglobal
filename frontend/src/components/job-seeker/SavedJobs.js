import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FilterListIcon from '@mui/icons-material/FilterList';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { useSavedJobs } from '../../context/SavedJobsContext';
import JobDetails from '../JobDetails';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const JobInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));



const SavedJobs = () => {
  const { savedJobs, loading: savedJobsLoading, unsaveJob, refreshSavedJobs } = useSavedJobs();
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    refreshSavedJobs();
  }, [refreshSavedJobs]);

  const handleRemoveJob = async (jobId) => {
    try {
      await unsaveJob(jobId);
      refreshSavedJobs();
    } catch (err) {
      setError('Failed to remove job from saved list');
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  if (selectedJob) {
    return (
      <JobDetails
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Saved Jobs</Typography>
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Box>

      <FilterSection>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="salary">Salary</MenuItem>
              <MenuItem value="company">Company</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Job Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="full-time">Full-time</MenuItem>
              <MenuItem value="part-time">Part-time</MenuItem>
              <MenuItem value="contract">Contract</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </FilterSection>

      {savedJobsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : !Array.isArray(savedJobs) || !savedJobs?.length ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You haven't saved any jobs yet.
          </Typography>
          <Button variant="contained" color="primary" href="/" sx={{ mt: 2 }}>
            Browse Jobs
          </Button>
        </Box>
      ) : savedJobs.map((job) => (
        <StyledCard key={job.id} onClick={() => handleJobClick(job)}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {job.title}
            </Typography>
            <JobInfo>
              <BusinessIcon fontSize="small" />
              <Typography variant="body2">{job.company_name}</Typography>
            </JobInfo>
            <JobInfo>
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2">{job.location}</Typography>
            </JobInfo>
            <JobInfo>
              <AttachMoneyIcon fontSize="small" />
              <Typography variant="body2">
                {job.currency} {job.salary_min} - {job.salary_max}
              </Typography>
            </JobInfo>
            <JobInfo>
              <DateRangeIcon fontSize="small" />
              <Typography variant="body2">
                Posted on {new Date(job.created_at).toLocaleDateString()}
              </Typography>
            </JobInfo>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {job.skills?.map((skill) => (
                <Chip
                  key={skill}
                  size="small"
                  label={skill}
                  variant="outlined"
                />
              ))}
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<BookmarkIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveJob(job.id);
              }}
            >
              Remove
            </Button>
          </CardActions>
        </StyledCard>
      ))}
    </Box>
  );
};

export default SavedJobs;