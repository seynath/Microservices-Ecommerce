const mongoose = require('mongoose');

// Sub-category Schema
const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, maxlength: 255 },
  image: { type: String, required: false }, // Image URL for sub-category
});

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, maxlength: 255 },
  image: { type: String, required: false }, // Image URL for category
  subCategories: [subCategorySchema], // Array of sub-category objects
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
