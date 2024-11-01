import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Snackbar, 
  Box,
  useTheme,
  useMediaQuery,
  Checkbox,
  FormControlLabel,
  Link,
  Stack
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import api from '../api';
import ProjectIcon from './ProjectIcon'; // Assuming this is your logo component

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = ({ setToken }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/api/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Login failed:', error.response?.data?.msg || error.message);
      setError(error.response?.data?.msg || 'An error occurred during login');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: 'background.paper'
    }}>
      {/* Left Section */}
      <Box sx={{ 
        flex: { xs: '1', md: '0 0 55%' },
        p: { xs: 2, sm: 4 },
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo and Branding */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          maxWidth: '275px',
          mb: { xs: 4, md: 8 }
        }}>
          <ProjectIcon sx={{ width: 50, height: 50, mr: 2 }} />
          <Typography 
            variant="h5" 
            component="span"
            sx={{ 
              fontWeight: 600,
              letterSpacing: '-0.5px'
            }}
          >
            Struct
          </Typography>
        </Box>

        {/* Main Content */}
        <Container maxWidth="sm" sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          mx: 'auto',
          width: '100%',
          maxWidth: { xs: '100%', sm: '400px' },
          mt: -7.5
        }}>
          <Typography 
            variant="h2" 
            component="h1" 
            align="center"
            sx={{ 
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 600
            }}
          >
            Welcome to Struct
          </Typography>
          
          <Typography 
            variant="body1" 
            align="center" 
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Struct empowers you to manage, enhance and safeguard your project management experience - putting you in control of your projects.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {/* Remember Me and Forgot Password row */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 1,
                mb: 2
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Remember Me
                  </Typography>
                }
              />
              <Link
                href="#"
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
            >
              Sign In
            </Button>

            {/* Sign Up link */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  href="#"
                  sx={{
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </form>
        </Container>
      </Box>

      {/* Right Section - Image */}
      {!isMobile && (
        <Box sx={{ 
          flex: '0 0 45%',
          bgcolor: 'grey.100', // Placeholder color
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography variant="body2" color="text.secondary">
            Placeholder for Image
          </Typography>
        </Box>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error || "Login successful!"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;