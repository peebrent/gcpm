import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Menu, 
  MenuItem 
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Login from './components/Login';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import AccountSettings from './components/AccountSettings';
import axios from 'axios';

const AppContent = ({ token, setToken }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const showHeader = location.pathname !== '/login';
  const [projects, setProjects] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  React.useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects', {
        headers: { 'x-auth-token': token }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProjectSelect = (projectId) => {
    navigate(`/projects/${projectId}`);
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showHeader && (
        <AppBar
          position="fixed"
          sx={{
            width: '100%',
            backgroundColor: 'white',
            color: 'black',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ minHeight: '48px !important', justifyContent: 'space-between' }}>
            <Button
              onClick={handleClick}
              endIcon={<ArrowDropDownIcon />}
              sx={{ 
                color: 'black',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              Projects
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                '& .MuiPaper-root': {
                  minWidth: '200px',
                  mt: 1
                }
              }}
            >
              {projects.map((project) => (
                <MenuItem 
                  key={project.id} 
                  onClick={() => handleProjectSelect(project.id)}
                  sx={{
                    fontSize: '0.875rem',
                    py: 1
                  }}
                >
                  {project.name}
                </MenuItem>
              ))}
            </Menu>
            <Box>
              <Button 
                color="inherit" 
                sx={{ 
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                }}
              >
                Help Center
              </Button>
              <Button 
                color="inherit"
                sx={{ 
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  ml: 2
                }}
              >
                User
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Toolbar placeholder to push content below AppBar */}
      {showHeader && <Toolbar sx={{ minHeight: '48px !important' }} />}

      {/* Main content area */}
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        width: '100%',
        position: 'relative'
      }}>
        <Routes>
          <Route 
            path="/login" 
            element={token ? <Navigate to="/projects" replace /> : <Login setToken={setToken} />} 
          />
          <Route 
            path="/projects" 
            element={token ? <ProjectList token={token} /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/projects/:projectId" 
            element={token ? <ProjectDetails token={token} /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/account-settings" 
            element={token ? <AccountSettings token={token} /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
          />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const setAndStoreToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent token={token} setToken={setAndStoreToken} />
      </Router>
    </ThemeProvider>
  );
}

export default App;