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
  CircularProgress,
  TextField,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
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
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import FlagIcon from '@mui/icons-material/Flag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5)
}));

const ClientCard = styled(Card)(({ theme }) => ({
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(2)
}));

const JobDetails = ({ job, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { profile, savedJobs, saveJob, removeJob, applyForJob } = useJobSeeker();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState(job.budget || '');
  const [estimatedDuration, setEstimatedDuration] = useState(job.duration || '');
  const [termsAccepted, setTermsAccepted] = useState(false);

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

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleApply = async () => {
    if (!termsAccepted) {
      setError('Please accept the terms and conditions to continue');
      return;
    }

    if (!coverLetter.trim()) {
      setError('Please provide a cover letter');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const applicationData = {
        cover_letter: coverLetter,
        bid_amount: bidAmount,
        estimated_duration: estimatedDuration
      };
      
      await applyForJob(job.id, applicationData);
      setSuccess('Application submitted successfully');
      setActiveStep(0); // Reset form
      setCoverLetter('');
      setBidAmount(job.budget || '');
      setEstimatedDuration(job.duration || '');
      setTermsAccepted(false);
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  // Format the client since field to a readable format (e.g., "Member since Mar 2023")
  const formatClientSince = () => {
    if (!job.client_since) return "New client";
    try {
      const date = new Date(job.client_since);
      return `Member since ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    } catch (e) {
      return job.client_since || "New client";
    }
  };

  // Job application steps
  const steps = ['Cover Letter', 'Proposal Terms', 'Review & Submit'];

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: { xs: 1, md: 3 } }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        variant="text" 
        onClick={onClose} 
        sx={{ mb: 2 }}
      >
        Back to Jobs
      </Button>
      
      <Grid container spacing={3}>
        {/* Left column - Job details */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h5">
                  {job.title}
                  {job.verified && (
                    <VerifiedIcon color="primary" sx={{ ml: 1, verticalAlign: 'middle' }} />
                  )}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {job.category} • Posted {job.time_ago}
                </Typography>
              </Box>
              
              <Button
                onClick={handleSaveJob}
                startIcon={isJobSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                color={isJobSaved ? 'primary' : 'inherit'}
                variant={isJobSaved ? 'contained' : 'outlined'}
                size="small"
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
            
            <Typography variant="h6" gutterBottom>Job Description</Typography>
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
              {job.description}
            </Typography>
            
            {job.requirements && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Requirements</Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {job.requirements}
                </Typography>
              </>
            )}

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Required Skills</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              {job.skills?.map((skill, index) => (
                <Chip key={index} label={skill} variant="outlined" />
              ))}
            </Box>
            
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>Activity on this job</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2" color="text.secondary">Proposals</Typography>
                <Typography variant="body1">{job.proposals || 'Less than 5'}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2" color="text.secondary">Last viewed by client</Typography>
                <Typography variant="body1">{job.last_viewed || 'Recently'}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2" color="text.secondary">Interviewing</Typography>
                <Typography variant="body1">{job.interviewing || '0'}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2" color="text.secondary">Invites sent</Typography>
                <Typography variant="body1">{job.invites_sent || '0'}</Typography>
              </Grid>
            </Grid>
          </StyledPaper>
          
          {/* Application Form */}
          <StyledPaper>
            <Typography variant="h6" gutterBottom>Submit a Proposal</Typography>
            
            <Stepper activeStep={activeStep} sx={{ my: 3 }} alternativeLabel={!isMobile}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{!isMobile && label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {activeStep === 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom>Cover Letter</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Introduce yourself and explain why you're a good fit for this job
                </Typography>
                
                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  label="Cover Letter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain why you're the best candidate for this job..."
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="contained" onClick={handleNextStep}>
                    Next
                  </Button>
                </Box>
              </>
            )}
            
            {activeStep === 1 && (
              <>
                <Typography variant="subtitle1" gutterBottom>Your Terms</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Set your bid and timeline for this project
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bid Amount"
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      InputProps={{
                        startAdornment: <Box sx={{ mr: 1 }}>{job.currency}</Box>,
                      }}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Estimated Duration (days)"
                      type="number"
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(e.target.value)}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button variant="outlined" onClick={handleBackStep}>
                    Back
                  </Button>
                  <Button variant="contained" onClick={handleNextStep}>
                    Next
                  </Button>
                </Box>
              </>
            )}
            
            {activeStep === 2 && (
              <>
                <Typography variant="subtitle1" gutterBottom>Review Your Proposal</Typography>
                
                <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography variant="subtitle2">Cover Letter:</Typography>
                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                    {coverLetter}
                  </Typography>
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Your Bid:</Typography>
                    <Typography variant="body1">{job.currency} {bidAmount}</Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Estimated Duration:</Typography>
                    <Typography variant="body1">{estimatedDuration} days</Typography>
                  </Grid>
                </Grid>
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                  }
                  label="I agree to the terms and conditions"
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button variant="outlined" onClick={handleBackStep}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleApply}
                    disabled={loading || !termsAccepted}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Submit Proposal'}
                  </Button>
                </Box>
              </>
            )}
          </StyledPaper>
        </Grid>
        
        {/* Right column - Client info and job details */}
        <Grid item xs={12} md={4}>
          <ClientCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>About the Client</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>
                  {job.company_name?.charAt(0) || 'C'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    {job.company_name}
                    {job.verified && (
                      <VerifiedIcon color="primary" fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.location || 'Unknown location'} • {formatClientSince()}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating 
                  value={parseFloat(job.client_rating) || 0} 
                  precision={0.1} 
                  readOnly 
                  size="small"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {job.client_reviews || 0} reviews
                </Typography>
              </Box>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PaymentIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Payment Verified" 
                    secondary={job.payment_verified ? "Payment method verified" : "Not verified yet"} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={job.company_name} 
                    secondary={job.industry || "Company"} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Jobs Posted" 
                    secondary={job.jobs_posted || "First job"} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EventAvailableIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Hire Rate" 
                    secondary={job.hire_rate || "New client"} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </ClientCard>
          
          <StyledPaper>
            <Typography variant="h6" gutterBottom>Job Details</Typography>
            
            <InfoItem>
              <AttachMoneyIcon color="action" />
              <Box>
                <Typography variant="subtitle2">Budget</Typography>
                <Typography variant="body1">
                  {job.currency} {job.budget}
                  {job.project_type === 'hourly' && '/hr'}
                </Typography>
              </Box>
            </InfoItem>
            
            <InfoItem>
              <WorkIcon color="action" />
              <Box>
                <Typography variant="subtitle2">Experience Level</Typography>
                <Typography variant="body1">{job.experience_level || 'Any level'}</Typography>
              </Box>
            </InfoItem>
            
            <InfoItem>
              <TimerIcon color="action" />
              <Box>
                <Typography variant="subtitle2">Project Length</Typography>
                <Typography variant="body1">
                  {job.duration ? `${job.duration} days` : 'Not specified'}
                </Typography>
              </Box>
            </InfoItem>
            
            <InfoItem>
              <DateRangeIcon color="action" />
              <Box>
                <Typography variant="subtitle2">Posted</Typography>
                <Typography variant="body1">{job.time_ago}</Typography>
              </Box>
            </InfoItem>
            
            {job.location && (
              <InfoItem>
                <LocationOnIcon color="action" />
                <Box>
                  <Typography variant="subtitle2">Location</Typography>
                  <Typography variant="body1">
                    {job.location}
                    {job.remote_work && ' (Remote work available)'}
                  </Typography>
                </Box>
              </InfoItem>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>Project Type</Typography>
            <Chip 
              label={job.project_type?.replace('_', ' ') || 'Not specified'} 
              size="small" 
              sx={{ mb: 2 }}
            />
            
            <Typography variant="subtitle2" gutterBottom>Category</Typography>
            <Chip 
              label={job.category || 'Not specified'} 
              size="small" 
              variant="outlined"
            />
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobDetails;