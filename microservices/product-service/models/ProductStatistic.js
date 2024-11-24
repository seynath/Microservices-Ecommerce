const mongoose = require('mongoose');

const productStatisticsSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  sold_quantity: { type: Number, default: 0 },
  view_count: { type: Number, default: 0 },
  add_to_cart_count: { type: Number, default: 0 },
  purchase_count: { type: Number, default: 0 },
  recent_trend_score: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('ProductStatistics', productStatisticsSchema);
