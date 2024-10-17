const { body } = require('express-validator');

const validateProduct = () => {
  return [
    // Basic validations
    body('name').not().isEmpty().withMessage('Name is required'),
    body('basePrice').isNumeric().withMessage('Base price must be a number'),
    body('categoryId').not().isEmpty().withMessage('Category ID is required'),
    body('subcategoryId').not().isEmpty().withMessage('Category ID is required'),

    // Validation for images (array of strings representing URLs)
    body('images')
      .optional()
      .isArray()
      .withMessage('Images must be an array')
      .custom((images) => {
        if (!images.every((image) => typeof image === 'string')) {
          throw new Error('Each image URL must be a string');
        }
        return true;
      }),

    // Validation for variants
    body('variants')
      .optional()
      .isArray()
      .withMessage('Variants must be an array')
      .custom((variants) => {
        if (variants.length === 0) {
          throw new Error('At least one variant is required if variants are provided');
        }

        variants.forEach((variant, index) => {
          // Validate size and color (optional but must be strings if present)
          if (variant.size && typeof variant.size !== 'string') {
            throw new Error(`Variant ${index + 1}: Size must be a string`);
          }
          if (variant.color && typeof variant.color !== 'string') {
            throw new Error(`Variant ${index + 1}: Color must be a string`);
          }

          // Validate price for each variant
          if (typeof variant.price !== 'number' || variant.price <= 0) {
            throw new Error(`Variant ${index + 1}: Price must be a positive number`);
          }

          // Validate stock_quantity for each variant
          if (!Number.isInteger(variant.stock_quantity) || variant.stock_quantity < 0) {
            throw new Error(`Variant ${index + 1}: Stock quantity must be a non-negative integer`);
          }
        });

        return true;
      }),

    // Validation for overall stock_quantity (this could be derived from the sum of variants, but still validated here)
    body('stock_quantity')
      .optional()
      .isNumeric()
      .withMessage('Stock quantity must be a number')
      .custom((value, { req }) => {
        // If variants are provided, ensure stock_quantity matches the sum of variant quantities
        if (req.body.variants && req.body.variants.length > 0) {
          const totalVariantStock = req.body.variants.reduce((acc, variant) => acc + variant.stock_quantity, 0);
          if (value !== totalVariantStock) {
            throw new Error('Stock quantity must match the sum of variant stock quantities');
          }
        }
        return true;
      }),
  ];
};

module.exports = { validateProduct };
