const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cartRoutes = require('./routes/cartRoutes');
const cors = require('cors');
const { connectRedis, client } = require('./config/redis');

// Load environment variables
dotenv.config();

// Enable CORS

// Initialize the Express app
const app = express();
app.use(cors());

// Use body-parser middleware to handle JSON requests
app.use(bodyParser.json());

// Connect to Redis asynchronously
(async () => {
  try {
    await connectRedis();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

// Cart routes
app.use('/cart', cartRoutes);  // Adjusted route for consistency with API standards

// Start the server
const PORT = process.env.PORT || 6004;
app.listen(PORT, () => {
  console.log(`Cart service running on port ${PORT}`);
});
