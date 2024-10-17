const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to authenticate the user based on the access token
const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // The token will be in the format "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }
  
  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    console.log(user)

    // Attach user data to request for access in next middleware
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = { authenticateToken };
