const { body, query, validationResult } = require('express-validator');

/**
 * Validation rules for creating a new post
 */
const validateCreatePost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters'),

  body('board')
    .trim()
    .notEmpty()
    .withMessage('Board is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Board name must be between 1 and 50 characters'),

  body('author')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Author name must not exceed 100 characters')
];

/**
 * Validation rules for getting posts by board
 */
const validateGetPosts = [
  query('board')
    .trim()
    .notEmpty()
    .withMessage('Board parameter is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Board name must be between 1 and 50 characters')
];

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }

  next();
};

module.exports = {
  validateCreatePost,
  validateGetPosts,
  handleValidationErrors
};
