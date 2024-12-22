const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  startDate: { type: Date, required: true },
  deadline: { type: Date, required: true },
  taskStatus: { type: String, enum: ['todo', 'inProgress', 'inReview', 'completed'], default: 'todo' },
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
