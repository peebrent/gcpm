import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Container, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Input } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProjectDetails = ({ token }) => {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });
  const [selectedFile, setSelectedFile] = useState(null);
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectDetails();
    fetchTasks();
  }, [projectId, token]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`, {
        headers: { 'x-auth-token': token }
      });
      setProject(response.data);
    } catch (error) {
      console.error('Failed to fetch project details:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/api/tasks/project/${projectId}`, {
        headers: { 'x-auth-token': token }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTask({ title: '', description: '', status: 'To Do' });
  };

  const handleCreate = async () => {
    try {
      await axios.post('/api/tasks', { ...newTask, projectId }, {
        headers: { 'x-auth-token': token }
      });
      handleClose();
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleBack = () => {
    navigate('/projects');
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(`/api/projects/${projectId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        },
      });
      setProject({ ...project, imageUrl: response.data.imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (!project) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <IconButton onClick={handleBack} edge="start" color="inherit" aria-label="back" style={{ marginBottom: '20px' }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" component="h2" gutterBottom>
        {project.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {project.description}
      </Typography>
      
      {/* Image Upload Section */}
      <Typography variant="h6" component="h3" gutterBottom style={{ marginTop: '20px' }}>
        Project Image
      </Typography>
      {project.imageUrl && (
        <img src={project.imageUrl} alt="Project" style={{ maxWidth: '100%', marginBottom: '20px' }} />
      )}
      <Input type="file" onChange={handleFileSelect} style={{ marginBottom: '10px' }} />
      <Button onClick={handleUpload} variant="contained" color="primary" style={{ marginBottom: '20px' }}>
        Upload Image
      </Button>

      <Typography variant="h5" component="h3" gutterBottom style={{ marginTop: '20px' }}>
        Tasks
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginBottom: '20px' }}>
        Add New Task
      </Button>
      <List>
        {tasks.map(task => (
          <ListItem key={task.id}>
            <ListItemText 
              primary={task.title} 
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary">
                    {task.description}
                  </Typography>
                  {" — "}{task.status}
                </>
              } 
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Task Title"
            type="text"
            fullWidth
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <TextField
            margin="dense"
            id="description"
            label="Task Description"
            type="text"
            fullWidth
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <TextField
            select
            margin="dense"
            id="status"
            label="Status"
            fullWidth
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            SelectProps={{
              native: true,
            }}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectDetails;