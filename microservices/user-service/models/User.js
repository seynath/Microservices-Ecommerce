const pool = require('../config/db');

// Create User table if it doesn't exist
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      mobile VARCHAR(15) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  // await pool.query(query);
  try {
    await pool.query(query);
    console.log('Users table created successfully');
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};
createTable();

// Function to create a new user
const createUser = async (name, email, hashedPassword,mobile) => {
  const query = `
    INSERT INTO users (name, email, password, mobile)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [name, email, hashedPassword, mobile];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Function to find user by email
const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

module.exports = { createUser, findUserByEmail , createTable};
