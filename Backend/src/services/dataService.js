// src/services/dataService.js

const fs = require('fs');
const path = require('path');

const generateRandomData = () => {
  const timestamp = new Date().toISOString();
  const temperature = (Math.random() * 80).toFixed(2); // Random temperature between 0 and 100
  const pressure = (Math.random() * 10).toFixed(2); // Random pressure between 0 and 10

  return {
    timestamp,
    temperature,
    pressure,
  };
};

const getLastFiveElements = () => {
  const filePath = path.join(__dirname, '..', 'data.json'); // Adjust path to data.json
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileData);

    // Get the last five elements
    return jsonData.slice(-5);
  } catch (err) {
    console.error('Failed to read or parse data file', err);
    return []; // Return an empty array on failure
  }
};

module.exports = { generateRandomData, getLastFiveElements };
