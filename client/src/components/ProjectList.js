import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Container } from '@mui/material';

const ProjectList = ({ token }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects', {
          headers: { 'x-auth-token': token }
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, [token]);

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Projects
      </Typography>
      <List>
        {projects.map(project => (
          <ListItem key={project.id}>
            <ListItemText primary={project.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ProjectList;