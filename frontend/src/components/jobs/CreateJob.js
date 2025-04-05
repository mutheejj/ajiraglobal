import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Paper,
  MenuItem,
  Divider,
  InputAdornment,
  Select,
  Chip,
  FormControl,
  InputLabel,
  OutlinedInput,
  Autocomplete,
  FormHelperText,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SaveIcon from '@mui/icons-material/Save';
import PublishIcon from '@mui/icons-material/Publish';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4)
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: -8,
    width: '40px',
    height: '3px',
    backgroundColor: theme.palette.primary.main
  }
}));

const commonCategories = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Content Writing',
  'Digital Marketing',
  'Data Science',
  'Graphic Design',
  'Video Editing',
  'Virtual Assistant',
  'Administrative Support',
  'Customer Service',
  'Sales & Marketing',
  'Software Development',
  'Consulting',
  'Legal',
  'Accounting & Finance',
  'Other'
];

const commonSkills = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Django', 'HTML', 'CSS',
  'Angular', 'Vue.js', 'PHP', 'Laravel', 'WordPress', 'UI Design',
  'UX Design', 'Graphic Design', 'Illustration', 'Photoshop',
  'Content Writing', 'SEO', 'Digital Marketing', 'Social Media Management',
  'Data Analysis', 'Machine Learning', 'AWS', 'Azure', 'Google Cloud',
  'DevOps', 'Mobile Development', 'iOS', 'Android', 'Flutter', 'React Native'
];

const CreateJob = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    requirements: '',
    responsibilities: '',
    skills: [],
    experience_level: 'entry',
    project_type: 'full_time',
    budget: '',
    salary_min: '',
    salary_max: '',
    currency: 'KSH',
    duration: '',
    location: '',
    remote_work: false,
    industry: '',
    company_culture: '',
    benefits: '',
    application_deadline: '',
    status: 'draft'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSkillChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      skills: newValue
    }));
    
    // Clear error when field is edited
    if (errors.skills) {
      setErrors(prev => ({ ...prev, skills: null }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      const updatedSkills = [...formData.skills, newSkill];
      setFormData(prev => ({
        ...prev,
        skills: updatedSkills
      }));
      setNewSkill('');
      
      // Clear error when field is edited
      if (errors.skills) {
        setErrors(prev => ({ ...prev, skills: null }));
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const validateStep = (step) => {
    let stepErrors = {};
    let isValid = true;
    
    if (step === 0) {
      // Basic info validation
      if (!formData.title.trim()) {
        stepErrors.title = 'Title is required';
        isValid = false;
      }
      
      if (!formData.category.trim()) {
        stepErrors.category = 'Category is required';
        isValid = false;
      }
      
      if (!formData.description.trim()) {
        stepErrors.description = 'Description is required';
        isValid = false;
      }
      
      if (!formData.requirements.trim()) {
        stepErrors.requirements = 'Requirements are required';
        isValid = false;
      }
    } 
    else if (step === 1) {
      // Skills and experience validation
      if (formData.skills.length === 0) {
        stepErrors.skills = 'At least one skill is required';
        isValid = false;
      }
    }
    else if (step === 2) {
      // Payment and timing validation
      if (!formData.budget || parseFloat(formData.budget) <= 0) {
        stepErrors.budget = 'A valid budget amount is required';
        isValid = false;
      }
      
      if (!formData.duration || parseInt(formData.duration) <= 0) {
        stepErrors.duration = 'A valid duration is required';
        isValid = false;
      }

      // Validate salary range if provided
      if (formData.salary_min && formData.salary_max && 
          parseFloat(formData.salary_min) > parseFloat(formData.salary_max)) {
        stepErrors.salary_min = 'Minimum salary cannot be greater than maximum';
        isValid = false;
      }
    }
    
    setErrors(stepErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleSaveAsDraft = async () => {
    try {
      setLoading(true);
      
      // Clean up the data
      const jobData = {
        ...formData,
        status: 'draft'
      };
      
      const response = await axios.post('/api/jobs/', jobData);
      toast.success('Job saved as draft!');
      navigate('/client-dashboard');
    } catch (error) {
      console.error('Error saving job as draft:', error);
      toast.error(error.response?.data?.detail || 'Failed to save job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validate all steps before final submission
    const basicInfoValid = validateStep(0);
    const skillsValid = validateStep(1);
    const paymentValid = validateStep(2);
    
    if (!basicInfoValid || !skillsValid || !paymentValid) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Clean up the data for submission
      const jobData = {
        ...formData,
        status: 'active'
      };
      
      // Ensure numeric fields are properly formatted
      jobData.budget = parseFloat(jobData.budget).toFixed(2);
      jobData.duration = parseInt(jobData.duration);
      
      if (jobData.salary_min) {
        jobData.salary_min = parseFloat(jobData.salary_min).toFixed(2);
      }
      
      if (jobData.salary_max) {
        jobData.salary_max = parseFloat(jobData.salary_max).toFixed(2);
      }

      const response = await axios.post('/api/jobs/', jobData);
      toast.success('Job posted successfully!');
      navigate('/client-dashboard');
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error(error.response?.data?.detail || 'Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Basic Information', 'Skills & Experience', 'Budget & Timeline'];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Create New Job
      </Typography>
      
      <StyledPaper>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === 0 && (
          <FormSection>
            <SectionTitle variant="h5" gutterBottom>
              Basic Information
            </SectionTitle>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Job Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.title}
                  helperText={errors.title}
                  placeholder="e.g. Senior React Developer"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                    required
                  >
                    {commonCategories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  fullWidth
                  placeholder="e.g. Technology, Healthcare, Education"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Job Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  required
                  error={!!errors.description}
                  helperText={errors.description}
                  placeholder="Describe the job role, responsibilities, and what the candidate will be working on..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                        <DescriptionIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  required
                  error={!!errors.requirements}
                  helperText={errors.requirements}
                  placeholder="List the qualifications, experience, and skills required for this position..."
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Responsibilities"
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="List the main duties and responsibilities for this position..."
                />
              </Grid>
            </Grid>
          </FormSection>
        )}
        
        {activeStep === 1 && (
          <FormSection>
            <SectionTitle variant="h5" gutterBottom>
              Skills & Experience
            </SectionTitle>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  id="skills-input"
                  options={commonSkills.filter(skill => !formData.skills.includes(skill))}
                  value={formData.skills}
                  onChange={handleSkillChange}
                  freeSolo
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Required Skills"
                      placeholder="Add skills..."
                      error={!!errors.skills}
                      helperText={errors.skills}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <WorkIcon />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="experience-level-label">Experience Level</InputLabel>
                  <Select
                    labelId="experience-level-label"
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    label="Experience Level"
                  >
                    <MenuItem value="entry">Entry Level</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="expert">Expert</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="project-type-label">Project Type</InputLabel>
                  <Select
                    labelId="project-type-label"
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleChange}
                    label="Project Type"
                  >
                    <MenuItem value="full_time">Full Time</MenuItem>
                    <MenuItem value="part_time">Part Time</MenuItem>
                    <MenuItem value="contract">Contract</MenuItem>
                    <MenuItem value="freelance">Freelance</MenuItem>
                    <MenuItem value="one_time">One-time Project</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Company Culture & Benefits"
                  name="company_culture"
                  value={formData.company_culture}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Describe your company culture and any benefits offered with this position..."
                />
              </Grid>
            </Grid>
          </FormSection>
        )}
        
        {activeStep === 2 && (
          <FormSection>
            <SectionTitle variant="h5" gutterBottom>
              Budget & Timeline
            </SectionTitle>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.budget}
                  helperText={errors.budget}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select
                          name="currency"
                          value={formData.currency}
                          onChange={handleChange}
                          variant="standard"
                          sx={{ mr: -2 }}
                        >
                          <MenuItem value="KSH">KSH</MenuItem>
                          <MenuItem value="USD">USD</MenuItem>
                          <MenuItem value="EUR">EUR</MenuItem>
                          <MenuItem value="GBP">GBP</MenuItem>
                        </Select>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Duration (days)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.duration}
                  helperText={errors.duration}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Minimum Salary"
                  name="salary_min"
                  type="number"
                  value={formData.salary_min}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.salary_min}
                  helperText={errors.salary_min}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {formData.currency}
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Maximum Salary"
                  name="salary_max"
                  type="number"
                  value={formData.salary_max}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {formData.currency}
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                  placeholder="e.g. Nairobi, Kenya"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Application Deadline"
                  name="application_deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.remote_work}
                      onChange={handleChange}
                      name="remote_work"
                      color="primary"
                    />
                  }
                  label="Remote Work Available"
                />
              </Grid>
            </Grid>
          </FormSection>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
          {activeStep > 0 ? (
            <Button 
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
          ) : (
            <Button 
              onClick={() => navigate(-1)}
              variant="outlined"
            >
              Cancel
            </Button>
          )}
          
          <Box>
            <Button
              onClick={handleSaveAsDraft}
              variant="outlined"
              sx={{ mr: 2 }}
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              Save as Draft
            </Button>
            
            {activeStep < steps.length - 1 ? (
              <Button 
                onClick={handleNext}
                variant="contained"
                disabled={loading}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                startIcon={<PublishIcon />}
                disabled={loading}
              >
                Post Job
              </Button>
            )}
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default CreateJob;