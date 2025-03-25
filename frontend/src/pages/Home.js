import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Paper, TextField, MenuItem, Chip, InputAdornment, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import JobAPI from '../services/JobAPI';

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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await JobAPI.getAllJobs();
        setJobs(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = selectedCategory === 'All Categories' || job.category === selectedCategory;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Find Your Perfect Project
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Browse through thousands of projects posted by clients worldwide
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search for projects..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            select
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

      {/* Active Filters */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap' }}>
        {selectedCategory !== 'All Categories' && (
          <FilterChip
            label={selectedCategory}
            onDelete={() => setSelectedCategory('All Categories')}
          />
        )}
      </Box>

      {/* Job Listings */}
      <Grid container spacing={3}>
        {filteredJobs.map((job) => (
          <Grid item xs={12} key={job.id}>
            <StyledJobCard>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {job.description}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {job.skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoneyIcon color="primary" />
                      <Typography variant="body2">{job.currency} {job.budget}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon color="primary" />
                      <Typography variant="body2">{job.duration}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkIcon color="primary" />
                      <Typography variant="body2">{job.experienceLevel}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Posted {job.postedDate}
                  </Typography>
                </Grid>
              </Grid>
            </StyledJobCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
