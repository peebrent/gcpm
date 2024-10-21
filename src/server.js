require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./config/database');
const projectRoutes = require('./routes/projects');
const app = express();
const authRoutes = require('./routes/auth');
console.log('JWT_SECRET:', process.env.JWT_SECRET);
// Middleware

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(helmet());
app.use(express.json());

// Check for JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Please set this environment variable.');
  process.exit(1);
}

// Database Connection
sequelize.sync({ alter: true }).then(() => {
  console.log('PostgreSQL connected and tables updated');
}).catch(err => console.error('PostgreSQL connection error:', err));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Project Management API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 50001;
let retries = 5;

function startServer(port) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy`);
      if (retries > 0) {
        retries--;
        const newPort = port + 1;
        console.log(`Trying port ${newPort}...`);
        startServer(newPort);
      } else {
        console.error('No available ports found after 5 attempts.');
        process.exit(1);
      }
    } else {
      console.error('An unexpected error occurred:', err);
      process.exit(1);
    }
  });
}

startServer(PORT);