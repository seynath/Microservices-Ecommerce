const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String }, // e.g., "S", "M", "L", "XL", etc. (optional)
  color: { type: String }, // e.g., "Red", "Blue", "Black", etc. (optional)
  price: { type: Number, required: true }, // The price for this variant
  stock_quantity: { type: Number, required: true }, // Stock for this specific variant
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, maxlength: 2000 },
  basePrice: { type: Number, required: true }, // Base price for the product without considering variants
  categoryId: { type: String, required: true }, // Reference to Category Service
  subcategoryId: { type: String }, // Reference to Category Service
  images: [{ type: String }], // Array of image URLs
  variants: [variantSchema], // Array of product variants
  stock_quantity: { type: Number, required: true }, // Total stock quantity across all variants
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
