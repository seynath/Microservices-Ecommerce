const pool = require('../config/db');


// Create User table if it doesn't exist
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS adminusers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
};
createTable();

// Function to create a new user
const createUser = async (name, email, hashedPassword, role) => {
  const query = `
    INSERT INTO adminusers (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [name, email, hashedPassword, role];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Function to find a user by email
const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM adminusers WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

module.exports = { createUser, findUserByEmail };
