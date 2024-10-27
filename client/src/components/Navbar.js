import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  MenuItem, 
  Menu, 
  Typography, 
  Box,
  Button
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import api from '../api';

const Navbar = ({ token }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProjects();
    fetchUserData();
  }, [token]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/users/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        height: '40px',
        backgroundColor: 'white',
        color: 'black',
        boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Toolbar sx={{ minHeight: '40px !important', height: '40px' }}>
        {/* Projects Dropdown */}
        <Box sx={{ flexGrow: 1 }}>
          <Button
            onClick={handleClick}
            endIcon={<ArrowDropDownIcon />}
            sx={{ 
              color: 'black',
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Projects
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {projects.map((project) => (
              <MenuItem 
                key={project.id} 
                onClick={handleClose}
                component={Link}
                to={`/projects/${project.id}`}
              >
                {project.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Help Center Link */}
        <Typography 
          component={Link} 
          to=""
          sx={{ 
            marginRight: 3,
            color: 'black',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          Help Center
        </Typography>

        {/* User Name Link */}
        <Typography 
          component={Link} 
          to="#"
          sx={{ 
            color: 'black',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          {user?.name || 'User'}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;