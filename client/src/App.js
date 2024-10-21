import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const setAndStoreToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <Router>
      <div className="App">
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
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;