const { body } = require('express-validator');

const validateCategory = () => {
  return [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('description').optional().isLength({ max: 255 }).withMessage('Description is too long'),

    // Validate category image URL
    body('image').optional().isURL().withMessage('Invalid image URL'),

    // Validate sub-categories
    body('subCategories').optional().isArray().withMessage('Sub-categories must be an array'),
    body('subCategories.*.name').optional().not().isEmpty().withMessage('Sub-category name is required'),
    body('subCategories.*.description').optional().isLength({ max: 255 }).withMessage('Sub-category description is too long'),

    // Validate sub-category image URL
    body('subCategories.*.image').optional().isURL().withMessage('Invalid sub-category image URL'),
  ];
};

module.exports = { validateCategory };
