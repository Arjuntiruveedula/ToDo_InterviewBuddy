// models/Project.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  startDate: { type: Date, required: true },
  deadline: { type: Date, required: true },
  taskStatus: { type: String, enum: ['todo', 'inProgress', 'inReview', 'completed'], default: 'todo' }
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tasks: {
    todo: [taskSchema],
    inProgress: [taskSchema],
    inReview: [taskSchema],
    completed: [taskSchema]
  }
});

module.exports = mongoose.model('Project', projectSchema);