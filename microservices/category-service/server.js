const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require('./middlewares/errorHandler');
const morgan = require('morgan');
require('dotenv').config();
const startGrpcServer = require('./grpcServer'); // gRPC server

const cors = require('cors');

// Initialize the Express app
const app = express();

// Enable CORS
app.use(cors());
// Connect to MongoDB
connectDB();
app.use(morgan('dev')); // Logging

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/category', categoryRoutes);
startGrpcServer();


// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 6002;
app.listen(PORT, () => {
  console.log(`Category service running on port ${PORT}`);
});
