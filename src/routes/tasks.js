const express = require('express');
const router = express.Router();
const { Task } = require('../models/Task');
const { Project } = require('../models/Project');
const auth = require('../middleware/auth');

// Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, projectId, assigneeId } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
      assigneeId,
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all tasks for a specific project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.projectId, ownerId: req.user.id },
    });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found or not authorized' });
    }
    const tasks = await Task.findAll({ where: { projectId: req.params.projectId } });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a specific task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    const project = await Project.findByPk(task.projectId);
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    const project = await Project.findByPk(task.projectId);
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    const { title, description, status, priority, dueDate, assigneeId } = req.body;
    task = await task.update({
      title,
      description,
      status,
      priority,
      dueDate,
      assigneeId,
    });
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    const project = await Project.findByPk(task.projectId);
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    await task.destroy();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;