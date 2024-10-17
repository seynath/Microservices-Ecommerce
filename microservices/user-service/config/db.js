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




// const { Pool } = require('pg');
// require('dotenv').config();

// // Set up PostgreSQL connection
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// pool.on('connect', () => {
//   console.log('Connected to PostgreSQL database');
// });

// module.exports = pool;
