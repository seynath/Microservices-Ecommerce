const mongoose = require('mongoose');


const userProductInteractionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interactionType: { type: String, enum: ['view', 'add_to_cart', 'purchase'] },
  interactionScore: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProductInteraction', userProductInteractionSchema);
