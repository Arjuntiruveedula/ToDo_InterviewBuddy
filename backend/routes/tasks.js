// backend/routes/tasks.js
const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

// Add a task to a project
router.post('/:projectId', async (req, res) => {
  const { taskName, startDate, deadline, taskStatus } = req.body;
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newTask = { taskName, startDate, deadline, taskStatus };
    project.tasks[taskStatus].push(newTask);
    await project.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit a task
router.put('/:projectId/:taskStatus/:taskId', async (req, res) => {
  const { taskName, startDate, deadline, taskStatus } = req.body;
  const { projectId, taskStatus: currentStatus, taskId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const taskIndex = project.tasks[currentStatus].findIndex(task => task._id.toString() === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = {
      taskName,
      startDate,
      deadline,
      taskStatus: currentStatus,
    };

    project.tasks[currentStatus][taskIndex] = updatedTask;
    await project.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
