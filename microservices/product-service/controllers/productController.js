const { validationResult } = require("express-validator");
const Product = require("../models/Product");
const asyncHandler = require("../middlewares/asyncHandler");
const axios = require("axios");
const {
  getCategoryById,
  getSubCategoryById,
  getAllCategories,
} = require("../grpcClient");
require("dotenv").config();

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    description,
    basePrice,
    categoryId,
    images,
    variants,
    subcategoryId,
    brand,
    tags,
  } = req.body;

  // Validate category with Category Service
  const categoryResponse = await axios.get(
    `${process.env.CATEGORY_SERVICE_URL}/${categoryId}`
  );
  if (!categoryResponse.data) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Calculate total stock quantity based on variants
  let totalStock = 0;
  if (variants && variants.length > 0) {
    totalStock = variants.reduce(
      (acc, variant) => acc + variant.stock_quantity,
      0
    );
  }

  const product = new Product({
    name,
    description,
    basePrice,
    categoryId,
    images,
    variants,
    stock_quantity: totalStock,
    subcategoryId,
    brand,
    tags,
  });

  await product.save();
  res.status(201).json(product);
});

// Get all products with category and sub-category details
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    console.log(products);
    console.log("/////////////");
    console.log("/////////////");
    // console.log("/////////////");
    // Fetch all categories from Category Service
    // const categoryResponse = await axios.get(`${process.env.CATEGORY_SERVICE_URL}/`);
    // const categories = categoryResponse.data;

    const categories = await getAllCategories();
    // console.log("huhh",categories);

    const categoryMap = new Map();
    categories.forEach((category) => {
      // console.log('category', category)
      categoryMap.set(category._id, category); // Map categories by their ID
    });

    // const subCategoryMap = new Map();
    // categories.forEach(category => {
    //   category.subCategories.forEach(subCat => {
    //     subCategoryMap.set(subCat._id, subCat); // Map subcategories by their ID
    //   });
    // });
    console.log(categoryMap);
    // console.log(subCategoryMap);

    const productsWithCategoryDetails = products.map((product) => {
      const category = categoryMap.get(product.categoryId) || null;

      let subCategory = null;
      if (product.subcategoryId && category && category.subCategories) {
        subCategory =
          category.subCategories.find(
            (subCat) => subCat._id === product.subcategoryId
          ) || null;
      }

      return {
        ...product.toObject(),
        category: category
          ? {
              _id: category._id,
              name: category.name,
              description: category.description,
              image: category.image,
            }
          : null,
        subCategory: subCategory
          ? {
              _id: subCategory._id,
              name: subCategory.name,
              description: subCategory.description,
              image: subCategory.image,
            }
          : null,
      };
    });

    res.status(200).json(productsWithCategoryDetails);
  } catch (error) {
    console.error(
      "Error fetching products with category details:",
      error.message
    );
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by ID
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json(product);
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, basePrice, categoryId, images, variants } =
    req.body;

  // Validate category if updated
  if (categoryId) {
    const categoryResponse = await axios.get(
      `${process.env.CATEGORY_SERVICE_URL}/${categoryId}`
    );
    if (!categoryResponse.data) {
      res.status(404);
      throw new Error("Category not found");
    }
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Calculate total stock quantity based on variants
  let totalStock = 0;
  if (variants && variants.length > 0) {
    totalStock = variants.reduce(
      (acc, variant) => acc + variant.stock_quantity,
      0
    );
  }

  // Update product fields
  product.name = name || product.name;
  product.description = description || product.description;
  product.basePrice = basePrice || product.basePrice;
  product.categoryId = categoryId || product.categoryId;
  product.images = images || product.images;
  product.variants = variants || product.variants;
  product.stock_quantity = totalStock || product.stock_quantity;

  await product.save();
  res.status(200).json(product);
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({ message: "Product removed" });
});

// Check product availability for a specific variant
const checkProductAvailability = asyncHandler(async (req, res) => {
  const { product_id } = req.params;
  const { quantity, variant_id } = req.query;

  const product = await Product.findById(product_id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  if (product.variants && product.variants.length > 0) {
    const variant = product.variants.find(
      (variant) => variant._id == variant_id
    );
    if (!variant) {
      res.status(404).json({ error: "Variant not found" });
      return;
    }

    if (variant.stock_quantity < quantity) {
      res
        .status(200)
        .json({
          error: "Insufficient stock quantity, not 0",
          product_id,
          variant_id,
          requestedQuantity: quantity,
          availableQuantity: variant.stock_quantity,
          price: variant.price,
          available: false,
        });
      return;
    }
  } else {
    if (product.stock_quantity < quantity) {
      res
        .status(200)
        .json({ error: "Insufficient stock quantity, 0 Quantity" });
      return;
    }
  }
  res.status(200).json({ available: true });
});

// Decrease product quantity
const decreaseQuantity = asyncHandler(async (req, res) => {
  const { product_id, variant_id, quantity } = req.body;

  const product = await Product.findById(product_id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  if (product.variants && product.variants.length > 0) {
    const variant = product.variants.find(
      (variant) => variant._id == variant_id
    );
    if (!variant) {
      res.status(404).json({ error: "Variant not found" });
      return;
    }

    if (variant.stock_quantity < quantity) {
      res.status(400).json({ error: "Insufficient stock quantity" });
      return;
    }

    variant.stock_quantity -= quantity;
  } else {
    if (product.stock_quantity < quantity) {
      res.status(400).json({ error: "Insufficient stock quantity" });
      return;
    }

    product.stock_quantity -= quantity;
  }

  await product.save();
  res.status(200).json({ message: "Stock quantity updated successfully" });
});

const decreaseQuantityFromQueue = async (product_id, variant_id, quantity) => {
  const product = await Product.findById(product_id);
  if (!product) {
    return false;
  }

  if (product.variants && product.variants.length > 0) {
    const variant = product.variants.find(
      (variant) => variant._id == variant_id
    );
    if (!variant) {
      return false;
    }

    if (variant.stock_quantity < quantity) {
      return false;
    }

    variant.stock_quantity -= quantity;
  } else {
    if (product.stock_quantity < quantity) {
      return false;
    }

    product.stock_quantity -= quantity;
  }

  await product.save();
  return true;
};

const updateProductRating = asyncHandler(async (req, res) => {
  const { product_id, rating } = req.body;

  try {
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Assume newRatingValue is provided (e.g., req.body.ratingValue)
    const newRatingValue = rating;

    // Get current total and count
    const currentCount = product.ratings; // current number of ratings
    const currentAverage = product.average_rating; // current average rating

    // Calculate the new total rating sum
    const currentTotal = currentAverage * currentCount;

    // Calculate new average rating
    const newAverageRating =
      (currentTotal + newRatingValue) / (currentCount + 1);

    // Update the product with the new average rating and increment ratings count
    const updatedProduct = await Product.findByIdAndUpdate(
      product_id,
      {
        average_rating: newAverageRating,
        ratings: currentCount + 1,
      },
      { new: true } // Return the updated product
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log("Error updating rating:", error); // Log the error!
    res.status(500).json({ error: "Failed to update rating" }); // Send an error response
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  checkProductAvailability,
  decreaseQuantity,
  decreaseQuantityFromQueue,
  updateProductRating,
};
