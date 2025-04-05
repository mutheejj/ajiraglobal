import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Paper, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';

import JobSeekerProfile from '../components/job-seeker/JobSeekerProfile';
import JobApplications from '../components/job-seeker/JobApplications';
import SavedJobs from '../components/job-seeker/SavedJobs';
import NotificationPreferences from '../components/job-seeker/NotificationPreferences';
import OngoingProjects from '../components/job-seeker/OngoingProjects';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
}));

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && children}
  </div>
);

const JobSeekerDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <StyledContainer maxWidth="lg">
      <Box sx={{ width: '100%' }}>
        <StyledTabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<PersonIcon />} label="Profile" />
          <Tab icon={<WorkIcon />} label="Applications" />
          <Tab icon={<BookmarkIcon />} label="Saved Jobs" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
          <Tab icon={<AssignmentIcon />} label="Projects" />
        </StyledTabs>

        <TabPanel value={currentTab} index={0}>
          <JobSeekerProfile />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <JobApplications />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <SavedJobs />
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <NotificationPreferences />
        </TabPanel>

        <TabPanel value={currentTab} index={4}>
          <OngoingProjects />
        </TabPanel>
      </Box>
    </StyledContainer>
  );
};

export default JobSeekerDashboard;