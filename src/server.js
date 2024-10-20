require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Database Connection
sequelize.sync({ alter: true }).then(() => {
  console.log('PostgreSQL connected and tables updated');
}).catch(err => console.error('PostgreSQL connection error:', err));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Project Management API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
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