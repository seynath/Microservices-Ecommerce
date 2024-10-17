const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/AdminUser');


const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userwithToken = { ...user, token };

    res.status(200).json({ message: 'Admin login successful' ,user: userwithToken});
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
}

const createAdmin = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashedPassword, 'admin');
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error });
  }
};

// Manage users
const manageUsers = async (req, res) => {
  try {
    const query = 'SELECT * FROM users';
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Manage products (add your product logic here)
const manageProducts = (req, res) => {
  res.json({ message: 'Admin managing products' });
};

// Generate reports (add your reporting logic here)
const generateReports = (req, res) => {
  res.json({ message: 'Admin generating reports' });
};

module.exports = { manageUsers, manageProducts, generateReports ,adminLogin,createAdmin};
