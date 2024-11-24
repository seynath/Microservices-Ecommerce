const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  emptyCart
} = require('../controllers/cartController');

const router = express.Router();

router.get('/:userId', getCart);
router.post('/:userId', addToCart);
router.put('/:userId', updateCartItem);
router.post('/delete/:userId', removeFromCart);
router.delete('/empty/:userId', emptyCart);

module.exports = router;
