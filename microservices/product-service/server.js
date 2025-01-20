const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');

// Initialize the Express app
const app = express();
app.use(cors());
app.use(morgan('dev'));
const amqp = require('amqplib');

const connectRabbitMQ = require('./config/rabbitMQ')
connectRabbitMQ();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/product', productRoutes);


// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 6003;
app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
});
