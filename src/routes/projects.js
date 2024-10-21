const express = require('express');
const router = express.Router();
const { Project } = require('../models/Project');
const auth = require('../middleware/auth');

// Create a new project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, status, startDate, endDate } = req.body;
    
    // Basic validation
    if (!name) {
      return res.status(400).json({ msg: 'Project name is required' });
    }

    const project = await Project.create({
      name,
      description,
      status,
      startDate,
      endDate,
      ownerId: req.user.id,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// Get all projects for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.findAll({ where: { ownerId: req.user.id } });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a specific project
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
    console.error(err.message);
    res.status(500).send('Server Error');
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
    const { name, description, status, startDate, endDate } = req.body;
    project = await project.update({
      name,
      description,
      status,
      startDate,
      endDate,
    });
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, ownerId: req.user.id },
    });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    await project.destroy();
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;