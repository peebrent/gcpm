import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Container } from '@mui/material';

const TaskList = ({ token, projectId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/project/${projectId}`, {
          headers: { 'x-auth-token': token }
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };
    fetchTasks();
  }, [token, projectId]);

  return (
    <Container>
      <Typography variant="h5" component="h3" gutterBottom>
        Tasks
      </Typography>
      <List>
        {tasks.map(task => (
          <ListItem key={task.id}>
            <ListItemText primary={task.title} secondary={task.status} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TaskList;