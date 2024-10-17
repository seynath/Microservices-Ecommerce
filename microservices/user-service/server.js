require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middlewares/errorHandler');
// cookie-parser
const cookieParser = require('cookie-parser');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 6001;

// Middleware
app.use(helmet()); // Security headers
// app.use(cors({
//   origin: process.env.ALLOWED_ORIGINS || '*', // Restrict to allowed origins
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));
// app.use(cors());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || 'http://localhost:5173', // Specify the client origin here
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials (cookies)
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev')); // Logging

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Routes
app.use('/user', userRoutes);

// Global error handling
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});