import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Box,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MuiAlert from '@mui/material/Alert';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const api = axios.create({
  baseURL: 'http://localhost:50001'
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProjectList = ({ token }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [message, setMessage] = useState({ text: '', severity: 'success' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects', {
        headers: { 'x-auth-token': token }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setMessage({ text: 'Failed to fetch projects. Please try again.', severity: 'error' });
      setOpenSnackbar(true);
    }
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewProject({ name: '', description: '' });
  };

  const handleCreate = async () => {
    try {
      const response = await api.post('/api/projects', newProject, {
        headers: { 'x-auth-token': token }
      });
      console.log('Project creation response:', response);
      handleClose();
      fetchProjects();
      setMessage({ text: 'Project created successfully!', severity: 'success' });
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Failed to create project:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      setMessage({ text: `Failed to create project: ${error.response ? error.response.data.msg : error.message}`, severity: 'error' });
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async (projectId, event) => {
    event.stopPropagation();
    try {
      await api.delete(`/api/projects/${projectId}`, {
        headers: { 'x-auth-token': token }
      });
      fetchProjects();
      setMessage({ text: 'Project deleted successfully!', severity: 'success' });
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Failed to delete project:', error);
      setMessage({ text: 'Failed to delete project. Please try again.', severity: 'error' });
      setOpenSnackbar(true);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Projects
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          sx={{ borderRadius: '8px' }}
        >
          New Project
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        label="Search Projects"
        InputProps={{
          startAdornment: (
            <SearchIcon color="action" />
          ),
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="view mode"
          size="small"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <GridViewIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Replace your existing projects display with this conditional rendering */}
{viewMode === 'grid' ? (
  <Grid container spacing={3}>
    {filteredProjects.map(project => (
      <Grid item xs={12} md={6} lg={4} key={project.id}>
        <Card 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            '&:hover': {
              boxShadow: 6,
              cursor: 'pointer'
            }
          }}
          onClick={() => handleProjectClick(project.id)}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {project.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {project.description}
            </Typography>
            {project.status && (
              <Chip 
                label={project.status} 
                size="small"
                color="primary"
              />
            )}
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <IconButton 
              size="small" 
              onClick={(e) => handleDelete(project.id, e)}
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
) : (
  <Paper elevation={2}>
    <List>
      {filteredProjects.map(project => (
        <React.Fragment key={project.id}>
          <ListItem 
            button
            onClick={() => handleProjectClick(project.id)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ListItemText 
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="subtitle1">
                    {project.name}
                  </Typography>
                  {project.status && (
                    <Chip 
                      label={project.status} 
                      size="small"
                      color="primary"
                    />
                  )}
                </Box>
              }
              secondary={project.description}
            />
            <IconButton 
              edge="end" 
              aria-label="delete" 
              onClick={(e) => handleDelete(project.id, e)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  </Paper>
)}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            label="Project Name"
            fullWidth
            required
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={message.severity}>
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProjectList;