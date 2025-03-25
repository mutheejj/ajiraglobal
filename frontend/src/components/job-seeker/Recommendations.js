import React from 'react';
import { Box, Typography, Paper, Chip, Avatar, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';

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

const ScrollableContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 200px)', // Adjust height as needed
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.light,
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

// Mock data for recommendations
const recommendations = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    location: 'Remote',
    type: 'Full-time',
    skills: ['React', 'TypeScript', 'Material-UI'],
    matchPercentage: 95,
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'Innovation Labs',
    location: 'New York, NY',
    type: 'Contract',
    skills: ['Node.js', 'React', 'MongoDB'],
    matchPercentage: 90,
  },
  {
    id: 3,
    title: 'UI/UX Developer',
    company: 'Design Studio',
    location: 'San Francisco, CA',
    type: 'Part-time',
    skills: ['Figma', 'React', 'CSS'],
    matchPercentage: 85,
  },
  {
    id: 4,
    title: 'Backend Developer',
    company: 'Data Systems Co.',
    location: 'Remote',
    type: 'Full-time',
    skills: ['Python', 'Django', 'PostgreSQL'],
    matchPercentage: 80,
  },
  {
    id: 5,
    title: 'Mobile App Developer',
    company: 'App Innovators',
    location: 'Austin, TX',
    type: 'Full-time',
    skills: ['React Native', 'JavaScript', 'Redux'],
    matchPercentage: 75,
  },
];

const Recommendations = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Job Recommendations
      </Typography>
      <ScrollableContainer>
        {recommendations.map((job) => (
          <StyledPaper key={job.id}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{job.title}</Typography>
                  <Chip
                    label={`${job.matchPercentage}% Match`}
                    color="primary"
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <BusinessIcon fontSize="small" />
                    <Typography variant="body2">{job.company}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body2">{job.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <WorkIcon fontSize="small" />
                    <Typography variant="body2">{job.type}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {job.skills.map((skill) => (
                    <SkillChip
                      key={skill}
                      label={skill}
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </StyledPaper>
        ))}
      </ScrollableContainer>
    </Box>
  );
};

export default Recommendations;