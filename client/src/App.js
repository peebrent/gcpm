import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import AccountSettings from './components/AccountSettings';
import Navbar from './components/Navbar';

// Wrapper component to handle navbar visibility
const NavbarWrapper = ({ token }) => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/login';
  
  return showNavbar ? <Navbar token={token} /> : null;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const setAndStoreToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <Router>
      <div className="App">
        <NavbarWrapper token={token} />
        <div style={{ marginTop: '40px' }}> {/* Add spacing below navbar */}
          <Routes>
            <Route path="/login" element={
              token ? <Navigate to="/projects" replace /> : <Login setToken={setAndStoreToken} />
            } />
            <Route path="/projects" element={
              token ? <ProjectList token={token} /> : <Navigate to="/login" replace />
            } />
            <Route path="/projects/:projectId" element={
              token ? <ProjectDetails token={token} /> : <Navigate to="/login" replace />
            } />
            <Route path="/account-settings" element={
              token ? <AccountSettings token={token} /> : <Navigate to="/login" replace />
            } />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;