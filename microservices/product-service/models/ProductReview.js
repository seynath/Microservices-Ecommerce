const mongoose = require('mongoose');

const productReviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 0, max: 5 },
  review: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProductReview', productReviewSchema);
