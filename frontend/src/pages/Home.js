import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Grid, Typography, Paper, MenuItem, Chip, CircularProgress, 
  Alert, TextField, InputAdornment, Rating, Divider, Card, CardContent, 
  Button, Select, FormControl, InputLabel, Slider, Autocomplete
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
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

const experienceLevels = [
  'All Levels',
  'Entry Level',
  'Intermediate',
  'Expert'
];

const projectTypes = [
  'All Types',
  'Fixed Price',
  'Hourly',
  'Long Term',
  'Short Term'
];

const StyledJobCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));

const FeaturedBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.warning.contrastText,
  padding: '4px 8px',
  borderTopRightRadius: '10px',
  borderBottomLeftRadius: '10px',
  fontSize: '0.75rem',
  fontWeight: 'bold',
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '&.MuiChip-filled': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const FiltersContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: '8px',
}));

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [experienceLevel, setExperienceLevel] = useState('All Levels');
  const [projectType, setProjectType] = useState('All Types');
  const [budgetRange, setBudgetRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await JobAPI.getAllJobs();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        // Add random featured status to some jobs for demo purposes
        const processedJobs = data.map(job => ({
          ...job,
          isFeatured: Math.random() > 0.8, // 20% chance to be featured
          // Add client rating if missing
          client_rating: job.client_rating || (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
          client_reviews: job.client_reviews || Math.floor(Math.random() * 50) + 1, // Random number of reviews
          proposals: job.proposals || Math.floor(Math.random() * 20) + 1, // Random number of proposals
        }));
        setJobs(processedJobs);
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

  const handleExperienceLevelChange = (event) => {
    setExperienceLevel(event.target.value);
  };

  const handleProjectTypeChange = (event) => {
    setProjectType(event.target.value);
  };

  const handleBudgetChange = (event, newValue) => {
    setBudgetRange(newValue);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filteredJobs = jobs.filter(job => {
    if (!job) return false;
    
    // Category filter
    const matchesCategory = selectedCategory === 'All Categories' || 
      (job.category && job.category === selectedCategory);
    
    // Experience level filter
    const matchesExperience = experienceLevel === 'All Levels' ||
      (job.experience_level && job.experience_level.toLowerCase() === experienceLevel.toLowerCase());
    
    // Project type filter
    const matchesProjectType = projectType === 'All Types' ||
      (job.project_type && job.project_type.replace('_', ' ').toLowerCase() === projectType.toLowerCase());
    
    // Budget filter
    const budget = parseFloat(job.budget) || 0;
    const matchesBudget = budget >= budgetRange[0] && budget <= budgetRange[1];
    
    // Search query
    const matchesSearch = searchQuery === '' || (
      (job.title && job.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.company_name && job.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.skills && job.skills.some(skill => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    );
    
    return matchesCategory && matchesExperience && matchesProjectType && matchesBudget && matchesSearch;
  });

  // Sort jobs to show featured first
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
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
          <Button 
            variant="outlined" 
            fullWidth 
            startIcon={<FilterListIcon />}
            onClick={toggleFilters}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Grid>
      </Grid>

      {showFilters && (
        <FiltersContainer elevation={0} variant="outlined">
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={experienceLevel}
                  onChange={handleExperienceLevelChange}
                  label="Experience Level"
                >
                  {experienceLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Project Type</InputLabel>
                <Select
                  value={projectType}
                  onChange={handleProjectTypeChange}
                  label="Project Type"
                >
                  {projectTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" gutterBottom>
                Budget Range (KSH)
              </Typography>
              <Slider
                value={budgetRange}
                onChange={handleBudgetChange}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={500}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">{budgetRange[0]}</Typography>
                <Typography variant="caption">{budgetRange[1]}</Typography>
              </Box>
            </Grid>
          </Grid>
        </FiltersContainer>
      )}

      {sortedJobs.length > 0 ? (
        <Grid container spacing={3}>
          {sortedJobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <StyledJobCard onClick={() => setSelectedJob(job)}>
                {job.isFeatured && (
                  <FeaturedBadge>Featured</FeaturedBadge>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6" gutterBottom>
                      {job.title}
                      {job.verified && (
                        <VerifiedIcon 
                          color="primary" 
                          fontSize="small" 
                          sx={{ ml: 1, verticalAlign: 'middle' }} 
                        />
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" color="primary" sx={{ mr: 2 }}>
                        {job.company_name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating 
                          value={parseFloat(job.client_rating) || 0} 
                          precision={0.1} 
                          size="small" 
                          readOnly 
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                          ({job.client_reviews})
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {job.description?.substring(0, 200)}...
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                        <strong>Required Skills:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {job.skills?.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AttachMoneyIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="subtitle1">
                            {job.currency} {job.budget}
                            {job.project_type === 'hourly' && '/hr'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.duration ? `${job.duration} days` : 'Not specified'} 
                            • {job.time_ago}
                          </Typography>
                        </Box>
                        {job.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {job.location}
                              {job.remote_work && ' • Remote'}
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ mt: 1, mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {job.proposals} proposals
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <FilterChip
                          icon={<WorkIcon />}
                          label={job.category || 'Not specified'}
                          size="small"
                        />
                        <FilterChip
                          label={job.experience_level || 'Any level'}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </StyledJobCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No jobs found matching your criteria
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your filters or search for different keywords
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Home;
