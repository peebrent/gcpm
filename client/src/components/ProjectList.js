import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Typography, 
  Container, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Snackbar 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';


const api = axios.create({
  baseURL: 'http://localhost:50001'  // Use your actual backend URL
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProjectList = ({ token }) => {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [message, setMessage] = useState({ text: '', severity: 'success' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`/api/projects/${projectId}`, {
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
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Projects
      </Typography>
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
        style={{ marginBottom: '20px' }}
      />
      <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginBottom: '20px' }}>
        Create New Project
      </Button>
      <List>
        {filteredProjects.map(project => (
          <ListItem key={project.id} button onClick={() => handleProjectClick(project.id)}>
            <ListItemText primary={project.name} secondary={project.description} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={(e) => {
                e.stopPropagation();
                handleDelete(project.id);
              }}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Project Name"
            type="text"
            fullWidth
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          />
          <TextField
            margin="dense"
            id="description"
            label="Project Description"
            type="text"
            fullWidth
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={message.severity} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProjectList;