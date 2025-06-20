const { body, validationResult } = require('express-validator');

exports.tagValidator = [
  body('name')
    .exists().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ min: 1, max: 50 }).withMessage('Name must be 1-50 characters'),
  body('slug')
    .exists().withMessage('Slug is required')
    .isString().withMessage('Slug must be a string')
    .trim()
    .notEmpty().withMessage('Slug cannot be empty')
    .isLength({ min: 1, max: 50 }).withMessage('Slug must be 1-50 characters')
    .matches(/^[a-z0-9-_]+$/i).withMessage('Slug must contain only letters, numbers, dashes, and underscores'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
]; 