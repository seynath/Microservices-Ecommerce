// Middleware to handle async functions and avoid repetitive try-catch blocks
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
