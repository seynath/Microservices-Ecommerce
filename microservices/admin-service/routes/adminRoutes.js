const express = require('express');
const { manageUsers, manageProducts, generateReports , adminLogin, createAdmin} = require('../controllers/adminController');
const adminAuth = require('../middlewares/adminAuth');

const router = express.Router();

// Admin routes (protected by adminAuth middleware)
router.post('/login', adminLogin); // Admin login
router.post('/create', createAdmin); // Admin registration

router.get('/users', adminAuth, manageUsers); // Admin can manage users
router.get('/products', adminAuth, manageProducts); // Admin can manage products
router.get('/reports', adminAuth, generateReports); // Admin can generate reports

module.exports = router;
