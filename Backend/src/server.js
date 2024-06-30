const http = require('http');
const app = require('./app');
const socketIo = require('socket.io');
const { generateRandomData } = require('./services/dataService');
const server = http.createServer(app);
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: '*', // Allow your Vue.js application's origin
  methods: ['GET'], // Allow only specific methods if needed
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});
 app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});
io.on('connection', (socket) => {
  console.log('Client connected');

  const filePath = path.join(__dirname, 'data.json');

  const sendRandomData = () => {
    const data = generateRandomData();

    // Emit new data to client
    socket.emit('data', data);

    // Read existing data from file
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        console.error('Error reading data.json', err);
        return;
      }

      let jsonData = JSON.parse(fileData);

      // Add new data to JSON array
      jsonData.push(data);

      // Ensure only the last five entries are kept
      const lastFive = jsonData.slice(-5);

      // Write updated JSON back to file
      const jsonDataString = JSON.stringify(lastFive, null, 2); // Convert lastFive to JSON string

      fs.writeFile(filePath, jsonDataString, (err) => {
        if (err) {
          console.error('Failed to save data', err);
        }
      });

      // Send the last five entries to the client
      socket.emit('lastFive', lastFive);
    });
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
