const express = require('express');
const { registerUser, loginUser,refreshToken ,getUser} = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);
// router.get('/',getUser)

router.post('/token', refreshToken)
router.get('/', authenticateToken, getUser);

module.exports = router;
