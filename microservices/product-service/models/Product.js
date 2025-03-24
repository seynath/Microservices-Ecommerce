const mongoose = require('mongoose');

// Each attribute is stored as a key-value pair
const attributeSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g., "size", "color", "material"
  value: { type: String, required: true }, // e.g., "M", "Red", "Cotton"
});

// Variant schema holds an array of attributes and fields for price and quantity
const variantSchema = new mongoose.Schema({
  attributes: [attributeSchema], // Array of key-value pairs for custom attributes
  price: { type: Number, required: true }, // Price for this variant
  stock_quantity: { type: Number, required: true }, // Stock for this specific variant
});

// Product schema with an array of variants, each with its own unique combination of attributes
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, maxlength: 2000 },
  basePrice: { type: Number, required: true }, // Base price without considering variants
  categoryId: { type: String, required: true }, // Reference to Category Service
  subcategoryId: { type: String }, // Reference to Category Service
  images: [{ type: String }], // Array of image URLs
  variants: [variantSchema], // Array of product variants with dynamic attributes
  stock_quantity: { type: Number, required: true }, // Total stock quantity across all variants
  brand: { type: String },
  sold_quantity: { type: Number, default: 0 },
  tags: [{ type: String }], // Tags for recommendation filtering
  ratings: { type: Number, default: 0 }, // Total rating for the product
  average_rating: { type: Number, default: 0 },
  view_count: { type: Number, default: 0 },
  // tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  // reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductReview' }],
  // launch_date: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);



// const mongoose = require('mongoose');

// // Each attribute is stored as a key-value pair
// const attributeSchema = new mongoose.Schema({
//   key: { type: String, required: true }, // e.g., "size", "color", "material"
//   value: { type: String, required: true }, // e.g., "M", "Red", "Cotton"
// });

// // Variant schema holds an array of attributes and fields for price and quantity
// const variantSchema = new mongoose.Schema({
//   attributes: [attributeSchema], // Array of key-value pairs for custom attributes
//   price: { type: Number, required: true }, // Price for this variant
//   stock_quantity: { type: Number, required: true }, // Stock for this specific variant
// });

// // Product schema with an array of variants, each with its own unique combination of attributes
// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, maxlength: 2000 },
//   basePrice: { type: Number, required: true }, // Base price without considering variants
//   categoryId: { type: String, required: true }, // Reference to Category Service
//   subcategoryId: { type: String }, // Reference to Category Service
//   images: [{ type: String }], // Array of image URLs
//   variants: [variantSchema], // Array of product variants with dynamic attributes
//   stock_quantity: { type: Number, required: true }, // Total stock quantity across all variants
// }, { timestamps: true });

// module.exports = mongoose.model('Product', productSchema);












// const mongoose = require('mongoose');

// const variantSchema = new mongoose.Schema({
//   size: { type: String }, // e.g., "S", "M", "L", "XL", etc. (optional)
//   color: { type: String }, // e.g., "Red", "Blue", "Black", etc. (optional)
//   price: { type: Number, required: true }, // The price for this variant
//   stock_quantity: { type: Number, required: true }, // Stock for this specific variant
// });

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, maxlength: 2000 },
//   basePrice: { type: Number, required: true }, // Base price for the product without considering variants
//   categoryId: { type: String, required: true }, // Reference to Category Service
//   subcategoryId: { type: String }, // Reference to Category Service
//   images: [{ type: String }], // Array of image URLs
//   variants: [variantSchema], // Array of product variants
//   stock_quantity: { type: Number, required: true }, // Total stock quantity across all variants
// }, { timestamps: true });

// module.exports = mongoose.model('Product', productSchema);
