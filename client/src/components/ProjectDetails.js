import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Container, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  IconButton,
  Paper,
  Box,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  Input,
  Snackbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import MuiAlert from '@mui/material/Alert';
import Sidebar from './Sidebar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProjectDetails = ({ token }) => {
  const theme = useTheme();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState({ text: '', severity: 'success' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
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
      showMessage('Failed to fetch project details', 'error');
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
      showMessage('Failed to fetch tasks', 'error');
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
      showMessage('Task created successfully', 'success');
    } catch (error) {
      console.error('Failed to create task:', error);
      showMessage('Failed to create task', 'error');
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
      showMessage('Please select a file first', 'error');
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
      showMessage('Image uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage('Failed to upload image', 'error');
    }
  };

  const showMessage = (text, severity) => {
    setMessage({ text, severity });
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'To Do': theme.palette.info.main,
      'In Progress': theme.palette.warning.main,
      'Done': theme.palette.success.main
    };
    return colors[status] || theme.palette.primary.main;
  };

  const handleSidebarNavigate = (route) => {
    console.log(`Navigating to: ${route}`);
  };

  if (!project) {
    return (
      <Box sx={{ ml: '150px', mt: '48px' }}>
        <Container maxWidth="lg">
          <Typography>Loading...</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100%', position: 'relative'  }}>
      {/* Sidebar */}
      <Box
        sx={{
          backgroundColor: '#1e2a38',
          left: 0,
          top: 0,
          bottom: 0,
          overflowY: 'auto'
        }}
      >
        <Sidebar onNavigate={handleSidebarNavigate} />
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          ml: '150px',
          p: 3,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton 
              onClick={handleBack} 
              sx={{ mr: 2 }}
              color="inherit"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              {project.name}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Project Details
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {project.description || 'No description provided'}
                    </Typography>
                  </Box>
                  {project.status && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Status
                      </Typography>
                      <Chip 
                        label={project.status} 
                        sx={{ mt: 1 }}
                        color="primary"
                      />
                    </Box>
                  )}
                  {project.startDate && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Start Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(project.startDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                  {project.endDate && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        End Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(project.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}

                  {/* Image Upload Section */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Project Image
                    </Typography>
                    {project.imageUrl && (
                      <Box sx={{ mb: 2 }}>
                        <img 
                          src={project.imageUrl} 
                          alt="Project" 
                          style={{ 
                            width: '100%', 
                            borderRadius: '4px',
                            marginBottom: '1rem' 
                          }} 
                        />
                      </Box>
                    )}
                    <Input 
                      type="file" 
                      onChange={handleFileSelect} 
                      sx={{ mb: 1, width: '100%' }} 
                    />
                    <Button 
                      onClick={handleUpload} 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                    >
                      Upload Image
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Tasks
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                  >
                    Add Task
                  </Button>
                </Box>
                <List>
                  {tasks.map(task => (
                    <Paper 
                      key={task.id} 
                      sx={{ 
                        mb: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.02)'
                        }
                      }}
                    >
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="subtitle1">{task.title}</Typography>
                              <Chip
                                label={task.status}
                                size="small"
                                sx={{
                                  backgroundColor: getStatusColor(task.status),
                                  color: 'white'
                                }}
                              />
                            </Box>
                          }
                          secondary={task.description}
                        />
                      </ListItem>
                    </Paper>
                  ))}
                  {tasks.length === 0 && (
                    <Typography color="textSecondary" align="center">
                      No tasks created yet
                    </Typography>
                  )}
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <TextField
                autoFocus
                label="Task Title"
                fullWidth
                required
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                select
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
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleCreate} variant="contained" color="primary">
                Add Task
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={message.severity}>
              {message.text}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
};

export default ProjectDetails;