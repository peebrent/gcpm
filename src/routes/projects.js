const express = require('express');
const router = express.Router();
const { Project } = require('../models/Project');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Add this new route to get all projects for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { ownerId: req.user.id },
      order: [['createdAt', 'DESC']] // Optional: Order by creation date, newest first
    });
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// Get a single project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, ownerId: req.user.id },
    });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// Update a project
router.put('/:id', auth, async (req, res) => {
  try {
    let project = await Project.findOne({
      where: { id: req.params.id, ownerId: req.user.id },
    });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    const { name, description, status, startDate, endDate, imageUrl } = req.body;
    project = await project.update({
      name,
      description,
      status,
      startDate,
      endDate,
      imageUrl, // Add this line to include imageUrl in the update
    });
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, description, status, startDate, endDate } = req.body;
    
    if (!name) {
      return res.status(400).json({ msg: 'Project name is required' });
    }

    console.log('Creating project with data:', { name, description, status, startDate, endDate, ownerId: req.user.id });

    const project = await Project.create({
      name,
      description,
      status,
      startDate,
      endDate,
      ownerId: req.user.id,
    });

    console.log('Project created successfully:', project);
    res.status(201).json(project);
  } catch (err) {
    console.error('Error creating project:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ msg: 'Server Error', error: err.message, stack: err.stack });
  }
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Route to handle image upload for a project
router.post('/:id/image', auth, upload.single('image'), async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, ownerId: req.user.id },
    });

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    await project.update({ imageUrl });

    res.json({ imageUrl });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router;