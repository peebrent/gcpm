import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Menu, 
  MenuItem, 
  Menu as AccountMenu 
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import theme from './theme';
import Login from './components/Login';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import AccountSettings from './components/AccountSettings';
import axios from 'axios';
import ProjectIcon from './components/ProjectIcon';

const AppContent = ({ token, setToken }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const showHeader = location.pathname !== '/login';
  const [projects, setProjects] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  useEffect(() => {
    const projectIdMatch = location.pathname.match(/\/projects\/(\d+)/);
    if (projectIdMatch && token) {
      const fetchCurrentProject = async () => {
        try {
          const response = await axios.get(`/api/projects/${projectIdMatch[1]}`, {
            headers: { 'x-auth-token': token }
          });
          setCurrentProject(response.data);
        } catch (error) {
          console.error('Failed to fetch current project:', error);
        }
      };
      fetchCurrentProject();
    } else {
      setCurrentProject(null);
    }
  }, [location.pathname, token]);

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

  const handleAccountClick = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAccountAnchorEl(null);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
    handleAccountClose();
  };

  const handleAccountSettings = () => {
    navigate('/account-settings');
    handleAccountClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showHeader && (
        <AppBar
          position="fixed"
          sx={{
            width: '100%',
            backgroundColor: '#fff',
            color: 'black',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ minHeight: '48px !important', justifyContent: 'space-between', pl: 2}}>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: -1.5 }}>
            <ProjectIcon 
              sx={{ 
                width: 32, 
                height: 32, 
                mr: -.5,  // margin-right
                display: 'block'
              }} 
            />
            <Button
              onClick={handleClick}
              endIcon={<ArrowDropDownIcon />}
              sx={{ 
                color: '#333',
                textTransform: 'none',
                fontSize: '.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {currentProject ? currentProject.name : 'PROJECTS'}
            </Button>
          </Box>
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
                onClick={handleAccountClick}
                endIcon={<ArrowDropDownIcon />}
                sx={{ 
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  ml: 2
                }}
              >
                User
              </Button>
              <AccountMenu
                anchorEl={accountAnchorEl}
                open={Boolean(accountAnchorEl)}
                onClose={handleAccountClose}
                sx={{
                  '& .MuiPaper-root': {
                    minWidth: '200px',
                    mt: 1
                  }
                }}
              >
                <MenuItem 
                  onClick={handleAccountSettings}
                  sx={{
                    fontSize: '0.875rem',
                    py: 1
                  }}
                >
                  Account Settings
                </MenuItem>
                <MenuItem 
                  onClick={handleLogout}
                  sx={{
                    fontSize: '0.875rem',
                    py: 1,
                    color: 'error.main'
                  }}
                >
                  Log Out
                </MenuItem>
              </AccountMenu>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Toolbar placeholder to push content below AppBar */}
      {showHeader && <Toolbar sx={{ minHeight: '48px !important' }} />}

      {/* Main content area */}
      <Box sx={{ 
        display: 'inline-grid', 
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
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Router>
          <AppContent token={token} setToken={setAndStoreToken} />
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;