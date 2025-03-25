import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Avatar,
  Grid,
  AvatarGroup,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ChatIcon from '@mui/icons-material/Chat';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PaymentIcon from '@mui/icons-material/Payment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

const ProjectInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: {
    'in-progress': theme.palette.info.light,
    completed: theme.palette.success.light,
    delayed: theme.palette.warning.light,
    blocked: theme.palette.error.light,
  }[status] || theme.palette.grey[300],
  color: {
    'in-progress': theme.palette.info.dark,
    completed: theme.palette.success.dark,
    delayed: theme.palette.warning.dark,
    blocked: theme.palette.error.dark,
  }[status] || theme.palette.grey[700],
}));

const projects = [
  {
    id: 1,
    name: 'E-commerce Platform Development',
    client: 'TechRetail Solutions',
    deadline: '2024-04-30',
    progress: 75,
    status: 'in-progress',
    team: [
      { name: 'Alice', avatar: '/avatars/alice.jpg' },
      { name: 'Bob', avatar: '/avatars/bob.jpg' },
      { name: 'Charlie', avatar: '/avatars/charlie.jpg' },
    ],
    completedTasks: 15,
    totalTasks: 20,
  },
  {
    id: 2,
    name: 'Mobile App UI/UX Design',
    client: 'HealthTech Innovations',
    deadline: '2024-05-15',
    progress: 40,
    status: 'delayed',
    team: [
      { name: 'David', avatar: '/avatars/david.jpg' },
      { name: 'Eva', avatar: '/avatars/eva.jpg' },
    ],
    completedTasks: 8,
    totalTasks: 15,
  },
  {
    id: 3,
    name: 'API Integration Project',
    client: 'FinTech Solutions',
    deadline: '2024-04-20',
    progress: 90,
    status: 'in-progress',
    team: [
      { name: 'Frank', avatar: '/avatars/frank.jpg' },
      { name: 'Grace', avatar: '/avatars/grace.jpg' },
      { name: 'Henry', avatar: '/avatars/henry.jpg' },
    ],
    completedTasks: 18,
    totalTasks: 20,
  },
];

const ChatMessage = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(1),
  '& .message-content': {
    maxWidth: '70%',
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(2),
    backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[200],
    color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  }
}));

const OngoingProjects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [messages, setMessages] = useState([]);

  const handleProjectAction = (project) => {
    setSelectedProject(project);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChatOpen = () => {
    setChatOpen(true);
    handleMenuClose();
  };

  const handleChatClose = () => {
    setChatOpen(false);
    setMessage('');
  };

  const handleMessageSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, isUser: true, timestamp: new Date() }]);
      setMessage('');
      // Simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: 'Thank you for your message. I will get back to you soon.',
          isUser: false,
          timestamp: new Date()
        }]);
      }, 1000);
    }
  };

  const handlePaymentRequest = () => {
    setPaymentDialogOpen(true);
    handleMenuClose();
  };

  const handleReportIssue = () => {
    setReportDialogOpen(true);
    handleMenuClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ position: 'relative' }}>      
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Ongoing Projects
      </Typography>
      {projects.map((project) => (
        <StyledPaper key={project.id}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <Typography variant="h6" gutterBottom>
                  {project.name}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {project.client}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, project)}
                sx={{ ml: 1 }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            <StatusChip
              label={project.status.replace('-', ' ').toUpperCase()}
              status={project.status}
              size="small"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {project.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={project.progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <ProjectInfo>
                <CalendarTodayIcon fontSize="small" />
                <Typography variant="body2">
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </Typography>
              </ProjectInfo>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ProjectInfo>
                <TaskAltIcon fontSize="small" />
                <Typography variant="body2">
                  Tasks: {project.completedTasks}/{project.totalTasks}
                </Typography>
              </ProjectInfo>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon fontSize="small" color="action" />
            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 30, height: 30 } }}>
              {project.team.map((member, index) => (
                <Avatar
                  key={index}
                  alt={member.name}
                  src={member.avatar}
                  sx={{ width: 30, height: 30 }}
                />
              ))}
            </AvatarGroup>
          </Box>
        </StyledPaper>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleChatOpen}>
          <ChatIcon sx={{ mr: 1 }} /> Chat with Client
        </MenuItem>
        <MenuItem onClick={handlePaymentRequest}>
          <PaymentIcon sx={{ mr: 1 }} /> Request Payment
        </MenuItem>
        <MenuItem onClick={handleReportIssue}>
          <ReportProblemIcon sx={{ mr: 1 }} /> Report Issue
        </MenuItem>
      </Menu>

      <Dialog
        open={chatOpen}
        onClose={handleChatClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chat with Client</DialogTitle>
        <DialogContent>
          <Box sx={{ height: 400, overflowY: 'auto', mb: 2 }}>
            {messages.map((msg, index) => (
              <ChatMessage key={index} isUser={msg.isUser}>
                <Box className="message-content">
                  <Typography variant="body2">{msg.text}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {msg.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              </ChatMessage>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleMessageSend()}
            />
            <IconButton color="primary">
              <AttachFileIcon />
            </IconButton>
            <IconButton color="primary">
              <ImageIcon />
            </IconButton>
            <IconButton color="primary" onClick={handleMessageSend}>
              <SendIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Payment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setPaymentDialogOpen(false);
              setSnackbar({
                open: true,
                message: 'Payment request sent successfully',
                severity: 'success'
              });
            }}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Report Issue</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Issue Type"
            select
            margin="normal"
          >
            <MenuItem value="technical">Technical Issue</MenuItem>
            <MenuItem value="communication">Communication Issue</MenuItem>
            <MenuItem value="payment">Payment Issue</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setReportDialogOpen(false);
              setSnackbar({
                open: true,
                message: 'Issue reported successfully',
                severity: 'success'
              });
            }}
          >
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OngoingProjects;