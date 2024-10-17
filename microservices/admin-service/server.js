require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 6001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors(
//   {
//   origin: process.env.ALLOWED_ORIGINS || '*', // Restrict to allowed origins
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Routes
app.use('/admin', adminRoutes);

// Global error handling
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Admin service running on port ${PORT}`);
});
