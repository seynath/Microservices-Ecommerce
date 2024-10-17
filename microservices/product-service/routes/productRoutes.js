const express = require('express');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { validateProduct } = require('../validations/productValidation');
const { validationResult } = require('express-validator');
const asyncHandler = require('../middlewares/asyncHandler');
const cloudinary = require('cloudinary').v2;

const router = express.Router();

// Middleware to check validation results
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

cloudinary.config({
  cloud_name: 'dzqihtcs4',
  api_key: '639143798718323',
  api_secret: '9CqrfxHvHVE7oknjGEYPlQnMR8k',
});


router.post('/', createProduct);
// router.post('/', validateProduct(), handleValidation, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', validateProduct(), handleValidation, updateProduct);
router.delete('/products/:id', deleteProduct);
router.delete('/delete-image',  async (req, res) => {
  console.log(req.body)
  const { public_id } = req.body;

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result === 'ok') {
      return res.status(200).json({ message: 'Image deleted successfully' });
    } else {
      return res.status(400).json({ message: 'Failed to delete image' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
