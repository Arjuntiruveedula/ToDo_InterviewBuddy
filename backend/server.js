// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const projectRoutes = require('./routes/projects');

dotenv.config();

const app = express();
const corsOptions = {
  origin: 'https://to-do-interview-buddy-4ml6.vercel.app',  // Allow only your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow only certain methods
  allowedHeaders: ['Content-Type'],  // Specify which headers are allowed
};
app.use(cors(corsOptions));  // Apply CORS with the custom configuration

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
