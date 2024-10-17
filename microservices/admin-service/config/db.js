const { Pool } = require('pg');
require('dotenv').config();

// Set up PostgreSQL connection using environment variables
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,  // or use other variants like POSTGRES_PRISMA_URL
  ssl: {
    rejectUnauthorized: false, // Required for SSL connections
  },
});

// Verify the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Error connecting to PostgreSQL database:', err);
});

module.exports = pool;

