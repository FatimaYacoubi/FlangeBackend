// src/routes/dataRoutes.js
const express = require('express');
const { getData,getLastFive } = require('../controllers/dataController');
const cors = require('cors'); // Import the CORS middleware
const router = express.Router();
const corsOptions = {
    origin: 'http://localhost:8080', // Allow your Vue.js application's origin
    methods: ['GET'], // Allow only GET method
    allowedHeaders: ['Content-Type', 'X-Requested-With'],
  };
router.get('/', getData);
router.get('/lastFive', cors(corsOptions), getLastFive);


module.exports = router;
