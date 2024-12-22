// routes/projects.js
const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  const project = new Project({
    name: req.body.name,
    tasks: { todo: [], inProgress: [], inReview: [], completed: [] }
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a task to a project
router.post('/:id/tasks', async (req, res) => {
  const { taskName, startDate, deadline, taskStatus } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const taskExists = project.tasks[taskStatus].some(task => task.taskName === taskName && task.startDate === startDate && task.deadline === deadline);
    if (!taskExists) {
      project.tasks[taskStatus].push({ taskName, startDate, deadline, taskStatus });
      await project.save();
      res.status(201).json(project);
    } else {
      res.status(400).json({ message: 'Task already exists' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Edit a task in a project
router.put('/:projectId/tasks/:taskId', async (req, res) => {
  const { projectId, taskId } = req.params;
  const { taskName, startDate, deadline, taskStatus } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = project.tasks[taskStatus].id(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.taskName = taskName;
    task.startDate = startDate;
    task.deadline = deadline;

    await project .save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a task from a project
router.delete('/:projectId/tasks/:taskId', async (req, res) => {
  const { projectId, taskId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = project.tasks.flatMap(status => status).find(task => task._id.toString() === taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    for (const status in project.tasks) {
      project.tasks[status] = project.tasks[status].filter(task => task._id.toString() !== taskId);
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;