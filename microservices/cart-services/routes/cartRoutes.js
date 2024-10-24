const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require('../controllers/cartController');

const router = express.Router();

router.get('/:userId', getCart);
router.post('/:userId', addToCart);
router.put('/:userId', updateCartItem);
router.post('/delete/:userId', removeFromCart);

module.exports = router;
