const sanitizeHtml = require('sanitize-html');

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes all HTML tags and dangerous content
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  // Remove all HTML tags and scripts
  return sanitizeHtml(input, {
    allowedTags: [], // No HTML tags allowed
    allowedAttributes: {},
    disallowedTagsMode: 'discard'
  });
};

/**
 * Recursively sanitize an object's string values
 */
const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * Middleware to sanitize request body, query, and params
 * Prevents HTML injection and XSS attacks
 */
const sanitizeMiddleware = (req, res, next) => {
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize route parameters
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

module.exports = {
  sanitizeMiddleware,
  sanitizeInput,
  sanitizeObject
};
