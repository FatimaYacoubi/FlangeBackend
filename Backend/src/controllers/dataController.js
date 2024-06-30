// src/controllers/dataController.js

const { generateRandomData, getLastFiveElements } = require('../services/dataService');

const getData = (req, res) => {
  console.log("Request received at GET /api/data");
  const data = generateRandomData();
  console.log("Data fetched:", data);
  res.json(data);
};

const getLastFive = (req, res) => {
  console.log("Request received at GET /api/data/lastFive");
  const data = getLastFiveElements();
  console.log("Data fetched:", data);
  res.json(data);
};

module.exports = { getData, getLastFive };
