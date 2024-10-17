const Category = require('../models/Category');
const asyncHandler = require('../middlewares/asyncHandler');

// Create a new category with sub-categories and image URLs
const createCategory = asyncHandler(async (req, res) => {
  console.log(req.body)
  const { name, description, image, subCategories } = req.body;

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = new Category({
    name,
    description,
    image, // Store category image URL
    subCategories, // Store sub-categories, which may also include image URLs
  });

  await category.save();
  res.status(201).json(category);
});

// Update category with image and sub-categories
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, image, subCategories } = req.body;

  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Update category fields
  category.name = name || category.name;
  category.description = description || category.description;
  category.image = image || category.image; // Update category image URL
  category.subCategories = subCategories || category.subCategories; // Update sub-categories, which may also include image URLs

  await category.save();
  res.status(200).json(category);
});

// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});

// Get a single category by ID
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.status(200).json(category);
});


// Delete a category
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  console.log("heheheh")

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  await category.deleteOne();
  res.status(200).json({ message: 'Category removed' });
});

module.exports = { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };
