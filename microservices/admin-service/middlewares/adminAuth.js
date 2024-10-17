const jwt = require('jsonwebtoken');


// Middleware to verify if the user is an admin
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user is an admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    req.user = decoded; // Add user data to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = adminAuth;
