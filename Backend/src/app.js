// src/app.js
const express = require('express');
const dataRoutes = require('./routes/dataRoutes');
const cors = require('cors'); // Import the CORS middleware
const app = express();

app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:8080', // Allow your Vue.js application's origin
    methods: ['GET'], // Allow only GET method
    allowedHeaders: ['Content-Type', 'X-Requested-With'],
  };
app.use('/api/data',  cors(corsOptions),dataRoutes);

module.exports = app;
