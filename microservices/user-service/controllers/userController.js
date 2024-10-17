const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/User');

// Function to generate access tokens
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7s' }); // Short-lived token
};

// Function to generate refresh tokens
const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '14s' }); // Long-lived token
};

// Register a new user
const registerUser = async (req, res) => {

  const { name, email, password ,mobile} = req.body;
  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = await createUser(name, email, hashedPassword,mobile);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    // Set the cookie with the token
    res.cookie('token', refreshToken, {
      httpOnly: true, // Prevents JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Ensure secure in production (requires HTTPS)
      sameSite: 'Strict', // Helps prevent CSRF attacks
      maxAge:  60 * 60 * 1000, // 1 hour expiration
    });

    const response = {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
      accessToken: accessToken,
      status: 'success'
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// const refreshToken = async (req, res) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) return res.sendStatus(401);

//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);

//     const newAccessToken = generateAccessToken({ id: user.id, name: user.name });
//     res.json({ accessToken: newAccessToken });
//   });
// };
const refreshToken = (req, res) => {

  const refreshToken = req.cookies.token;
  console.log(refreshToken)
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    
    console.log(user)
    const newAccessToken = generateAccessToken({ id: user.id, email: user.email });
    res.json({ accessToken: newAccessToken });
  });
};


const getUser = async (req, res) => {
  const { email } = req.user;
  console.log(email)
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { registerUser, loginUser ,refreshToken, getUser};
