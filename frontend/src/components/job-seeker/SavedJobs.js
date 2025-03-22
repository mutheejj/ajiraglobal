import React, { useState } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FilterListIcon from '@mui/icons-material/FilterList';

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

const savedJobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'Tech Innovators',
    location: 'Remote',
    salary: '$120k - $150k',
    type: 'Full-time',
    skills: ['React', 'TypeScript', 'Node.js'],
    postedDate: '2024-03-15',
  },
  {
    id: 2,
    title: 'Full Stack Developer',
    company: 'Digital Solutions',
    location: 'New York, NY',
    salary: '$100k - $130k',
    type: 'Contract',
    skills: ['React', 'Python', 'PostgreSQL'],
    postedDate: '2024-03-14',
  },
  {
    id: 3,
    title: 'Frontend Engineer',
    company: 'Creative Tech',
    location: 'San Francisco, CA',
    salary: '$110k - $140k',
    type: 'Part-time',
    skills: ['Vue.js', 'JavaScript', 'CSS'],
    postedDate: '2024-03-13',
  },
];

const SavedJobs = () => {
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');

  const handleRemoveJob = (jobId) => {
    // TODO: Implement remove job functionality
    console.log('Remove job:', jobId);
  };

  const handleApplyJob = (jobId) => {
    // TODO: Implement apply job functionality
    console.log('Apply to job:', jobId);
  };

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

      {savedJobs.map((job) => (
        <StyledCard key={job.id}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {job.title}
            </Typography>
            <JobInfo>
              <BusinessIcon fontSize="small" />
              <Typography variant="body2">{job.company}</Typography>
            </JobInfo>
            <JobInfo>
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2">{job.location}</Typography>
            </JobInfo>
            <JobInfo>
              <AttachMoneyIcon fontSize="small" />
              <Typography variant="body2">{job.salary}</Typography>
            </JobInfo>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                size="small"
                label={job.type}
                color="primary"
                variant="outlined"
              />
              {job.skills.map((skill) => (
                <Chip
                  key={skill}
                  size="small"
                  label={skill}
                  variant="outlined"
                />
              ))}
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<BookmarkIcon />}
              onClick={() => handleRemoveJob(job.id)}
            >
              Remove
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleApplyJob(job.id)}
            >
              Apply Now
            </Button>
          </CardActions>
        </StyledCard>
      ))}
    </Box>
  );
};

export default SavedJobs;