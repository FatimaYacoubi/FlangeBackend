const http = require('http');
const app = require('./app');
const socketIo = require('socket.io');
const { generateRandomData } = require('./services/dataService');
const server = http.createServer(app);
const path = require('path');
const fs = require('fs').promises; // Using fs.promises for async file operations
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: '*', // Allow your Vue.js application's origin
  methods: ['GET'], // Allow only specific methods if needed
  allowedHeaders: ['Content-Type'],
};

const io = socketIo(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors(corsOptions));

const filePath = path.join(__dirname, 'data.json');

// Function to initialize data.json if it doesn't exist
const initializeDataFile = async () => {
  try {
    // Check if file exists
    await fs.access(filePath);
  } catch (err) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(filePath, '[]');
  }
};

// Function to read data from data.json
const readDataFromFile = async () => {
  try {
    const fileData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (err) {
    console.error('Error reading data.json', err);
    return []; // Return empty array if file read fails
  }
};

// Function to write data to data.json
const writeDataToFile = async (data) => {
  try {
    const jsonDataString = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonDataString);
  } catch (err) {
    console.error('Failed to save data', err);
  }
};

io.on('connection', async (socket) => {
  console.log('Client connected');

  // Initialize data file if it doesn't exist
  await initializeDataFile();

  const sendRandomData = async () => {
    const data = generateRandomData();

    // Emit new data to client
    socket.emit('data', data);

    try {
      // Read existing data from file
      let jsonData = await readDataFromFile();

      // Add new data to JSON array
      jsonData.push(data);

      // If jsonData exceeds 10 entries, remove the oldest 5 entries
      const maxEntries = 10;
      if (jsonData.length > maxEntries) {
        jsonData = jsonData.slice(jsonData.length - maxEntries);
      }

      // Write updated JSON back to file
      await writeDataToFile(jsonData);

      // Send the last five entries to the client
      const lastFive = jsonData.slice(-5);
      socket.emit('lastFive', lastFive);
    } catch (err) {
      console.error('Error in sendRandomData', err);
    }
  };

  sendRandomData();

  // Set interval to send data every 5 seconds
  const interval = setInterval(sendRandomData, 5000);

  // Handle disconnect event
  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
