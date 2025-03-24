import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  maxWidth: '600px',
  margin: '0 auto',
}));

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: theme.spacing(2),
  textAlign: 'center',
  borderRadius: '5px',
  marginBottom: theme.spacing(2),
}));

const Content = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  padding: theme.spacing(2),
  borderRadius: '5px',
  marginBottom: theme.spacing(2),
}));

const JobDetails = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  padding: theme.spacing(2),
  borderRadius: '5px',
  marginBottom: theme.spacing(2),
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

const JobNotificationPreview = ({ jobData }) => {
  return (
    <StyledPaper>
      <Header>
        <Typography variant="h5">Email Notification Preview</Typography>
      </Header>

      <Content>
        <Typography variant="h6" gutterBottom>
          {jobData?.title || 'Job Title'}
        </Typography>
        <Typography variant="body1" paragraph>
          A new job matching your skills has been posted by {jobData?.companyName || 'Company Name'}!
        </Typography>

        <JobDetails>
          <Typography variant="h6" gutterBottom>Job Details:</Typography>
          <Typography><strong>Category:</strong> {jobData?.category || 'Category'}</Typography>
          <Typography><strong>Project Type:</strong> {jobData?.projectType || 'Project Type'}</Typography>
          <Typography><strong>Experience Level:</strong> {jobData?.experienceLevel || 'Experience Level'}</Typography>
          <Typography><strong>Budget:</strong> ${jobData?.budget || '0'}</Typography>
          <Typography><strong>Duration:</strong> {jobData?.duration || '0'} days</Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Required Skills:</Typography>
            {(jobData?.skills || ['Skill 1', 'Skill 2']).map((skill, index) => (
              <SkillChip key={index} label={skill} />
            ))}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Job Description:</Typography>
            <Typography variant="body2">
              {jobData?.description || 'Job description will appear here.'}
            </Typography>
          </Box>
        </JobDetails>
      </Content>

      <Typography variant="caption" color="text.secondary" align="center" display="block">
        This is a preview of the email notification that will be sent to matching job seekers.
      </Typography>
    </StyledPaper>
  );
};

export default JobNotificationPreview;