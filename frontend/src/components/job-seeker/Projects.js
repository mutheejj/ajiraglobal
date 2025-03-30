import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import CodeIcon from '@mui/icons-material/Code';
import { useJobSeeker } from '../../context/JobSeekerContext';
import JobAPI from '../../services/JobAPI';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const ProjectDialog = ({ open, onClose, project, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    live_url: '',
    github_url: '',
    ...project
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Project Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
          />
          <TextField
            label="Technologies (comma separated)"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            fullWidth
            required
            helperText="e.g. React, Node.js, MongoDB"
          />
          <TextField
            label="Live URL"
            name="live_url"
            value={formData.live_url}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="GitHub URL"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {project ? 'Update' : 'Add'} Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await JobAPI.getProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = () => {
    setSelectedProject(null);
    setDialogOpen(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await JobAPI.deleteProject(projectId);
      await fetchProjects();
      setError(null);
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  const handleSaveProject = async (projectData) => {
    try {
      if (selectedProject) {
        await JobAPI.updateProject(selectedProject.id, projectData);
      } else {
        await JobAPI.createProject(projectData);
      }
      await fetchProjects();
      setError(null);
    } catch (err) {
      setError('Failed to save project');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Projects</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddProject}
        >
          Add Project
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {projects.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No projects added yet. Click the 'Add Project' button to showcase your work.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <StyledCard>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {project.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {project.technologies.split(',').map((tech, index) => (
                      <Chip
                        key={index}
                        label={tech.trim()}
                        size="small"
                        icon={<CodeIcon />}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {project.live_url && (
                      <Button
                        size="small"
                        startIcon={<LinkIcon />}
                        href={project.live_url}
                        target="_blank"
                      >
                        Live Demo
                      </Button>
                    )}
                    {project.github_url && (
                      <Button
                        size="small"
                        startIcon={<CodeIcon />}
                        href={project.github_url}
                        target="_blank"
                      >
                        GitHub
                      </Button>
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditProject(project)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteProject(project.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      <ProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        project={selectedProject}
        onSave={handleSaveProject}
      />
    </Box>
  );
};

export default Projects;