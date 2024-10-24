const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const asyncHandler = require('../middlewares/asyncHandler');
const axios = require('axios');
const { getCategoryById, getSubCategoryById } = require('../grpcClient');
// dotenv
// require('dotenv').config();


// Create a new product
const createProduct = asyncHandler(async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, basePrice, categoryId, images, variants,subcategoryId } = req.body;
  console.log(req.body)

  // Validate category with Category Service
  const categoryResponse = await axios.get(`${process.env.CATEGORY_SERVICE_URL}/${categoryId}`);
  if (!categoryResponse.data) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Calculate total stock quantity based on variants
  let totalStock = 0;
  if (variants && variants.length > 0) {
    totalStock = variants.reduce((acc, variant) => acc + variant.stock_quantity, 0);
  }

  const product = new Product({
    name,
    description,
    basePrice,
    categoryId,
    images,
    variants,
    stock_quantity: totalStock,
    subcategoryId
  });

  await product.save();
  res.status(201).json(product);
});
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // Fetch all categories and subcategories in one request from Category Service
    const categoryResponse = await axios.get(`${process.env.CATEGORY_SERVICE_URL}/`); // Assuming your API supports fetching all categories and subcategories
    console.log(categoryResponse.data);
    const  categories  = categoryResponse.data; // Assuming response contains an array of categories
    // Create a category and subcategory map for quick lookup
    const categoryMap = new Map();
    categories.forEach(category => {
      categoryMap.set(category._id, category); // Map categories by their ID
    });

    // Process products and match categories and subcategories
    const productsWithCategoryDetails = products.map(product => {
      const category = categoryMap.get(product.categoryId) || null;

      let subCategory = null;
      if (product.subCategoryId && category && category.subCategories) {
        subCategory = category.subCategories.find(subCat => subCat._id === product.subCategoryId) || null;
      }

      // Construct the product object with category and subcategory details
      return {
        ...product.toObject(), // Convert product to plain object
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

    // Return products with category and sub-category details
    res.status(200).json(productsWithCategoryDetails);
  } catch (error) {
    console.error('Error fetching products with category details:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// // Get all products
// const getAllProducts = asyncHandler(async (req, res) => {
//   const products = await Product.find();
//   res.status(200).json(products);
// });

// Fetch all products and populate category and sub-category details

// Optimized getAllProducts controller

// const getAllProducts = asyncHandler(async (req, res) => {
//   const products = await Product.find();

//   const productsWithCategoryDetails = [];

//   for (const product of products) {
//     try {
//       // Fetch category details using gRPC
//       const category = await getCategoryById(product.categoryId);

//       let subCategory = null;
//       if (product.subCategoryId) {
//         // Fetch sub-category details using gRPC
//         subCategory = await getSubCategoryById(product.categoryId, product.subCategoryId);
//       }

//       const productWithDetails = {
//         ...product.toObject(),
//         category,
//         subCategory,
//       };

//       productsWithCategoryDetails.push(productWithDetails);
//     } catch (error) {
//       console.error(`Error fetching category data for product ${product._id}:`, error.message);
//     }
//   }

//   res.status(200).json(productsWithCategoryDetails);
// });






// const getAllProducts = asyncHandler(async (req, res) => {
//   // Fetch all products
//   const products = await Product.find();
// console.log(products)
//   // Initialize an array to hold products with populated category details
//   const productsWithCategoryDetails = [];

//   // Loop through each product and fetch category/sub-category details
//   for (const product of products) {
//     try {
//       // Fetch category from Category Service
//       const categoryResponse = await axios.get(`${process.env.CATEGORY_SERVICE_URL}/${product.categoryId}`);
//       // const categoryResponse = await getCategoryById(product.categoryId);
//       console.log(categoryResponse.data)
//       const categoryData = categoryResponse.data;

//       // If subCategoryId exists, find sub-category details within the category
//       let subCategory = null;
//       if (product.subCategoryId && categoryData.subCategories) {
//         subCategory = categoryData.subCategories.find(subCat => subCat._id === product.subCategoryId);
//       }

//       // Add category and sub-category data to the product
//       const productWithDetails = {
//         ...product.toObject(), // Convert product to plain object
//         category: {
//           _id: categoryData._id,
//           name: categoryData.name,
//           description: categoryData.description,
//           image: categoryData.image,
//         },
//         subCategory: subCategory
//           ? {
//               _id: subCategory._id,
//               name: subCategory.name,
//               description: subCategory.description,
//               image: subCategory.image,
//             }
//           : null, // If no sub-category, return null
//       };

//       // Add the product with category details to the array
//       productsWithCategoryDetails.push(productWithDetails);

//     } catch (error) {
//       console.error(`Error fetching category data for product ${product._id}:`, error.message);
//     }
//   }

//   // Return products with category and sub-category details
//   res.status(200).json(productsWithCategoryDetails);
// });

// Get product by ID
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json(product);
});


// Update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, basePrice, categoryId, images, variants } = req.body;
  console.log(variants)

  // Validate category if updated
  if (categoryId) {
    const categoryResponse = await axios.get(`${process.env.CATEGORY_SERVICE_URL}/${categoryId}`);
    if (!categoryResponse.data) {
      res.status(404);
      throw new Error('Category not found');
    }
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Calculate total stock quantity based on variants
  let totalStock = 0;
  if (variants && variants.length > 0) {
    totalStock = variants.reduce((acc, variant) => acc + variant.stock_quantity, 0);
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
    throw new Error('Product not found');
  }

  // await product.remove();
  res.status(200).json({ message: 'Product removed' });
});



module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
