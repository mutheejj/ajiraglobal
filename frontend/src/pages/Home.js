import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Paper, MenuItem, Chip, CircularProgress, Alert, TextField, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import JobAPI from '../services/JobAPI';
import JobDetails from '../components/JobDetails';
import SearchBar from '../components/common/SearchBar';

const categories = [
  'All Categories',
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Content Writing',
  'Digital Marketing',
  'Data Science',
  'Graphic Design',
  'Video Editing',
  'Virtual Assistant',
];

const StyledJobCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '&.MuiChip-filled': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await JobAPI.getAllJobs();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        setJobs(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch jobs. Please try again later.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }



  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredJobs = jobs.filter(job => {
    if (!job) return false;
    const matchesCategory = selectedCategory === 'All Categories' || 
      (job.category && job.category === selectedCategory);
    const matchesSearch = searchQuery === '' || (
      (job.title && job.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.company_name && job.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return matchesCategory && matchesSearch;
  });

  if (selectedJob) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <JobDetails 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Find Your Dream Job
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" gutterBottom>
          Discover opportunities that match your skills and aspirations
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for jobs, skills, or companies..."
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            variant="outlined"
            value={selectedCategory}
            onChange={handleCategoryChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              ),
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {filteredJobs.length > 0 ? (
        <Grid container spacing={3}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <StyledJobCard onClick={() => setSelectedJob(job)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6" gutterBottom>
                      {job.title}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {job.company_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {job.description?.substring(0, 200)}...
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <FilterChip
                        icon={<WorkIcon />}
                        label={job.category}
                        size="small"
                      />
                      <FilterChip
                        icon={<AttachMoneyIcon />}
                        label={`${job.currency} ${job.salary_min} - ${job.salary_max}`}
                        size="small"
                      />
                      <FilterChip
                        icon={<AccessTimeIcon />}
                        label={new Date(job.created_at).toLocaleDateString()}
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </StyledJobCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" align="center" color="text.secondary">
          No jobs found matching your criteria
        </Typography>
      )}
    </Container>
  );
};

export default Home;
