const { body, validationResult } = require('express-validator');

exports.createPostValidator = [
  body('title')
    .isString().trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),
  body('content')
    .isString().notEmpty().withMessage('Content is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updatePostValidator = [
  body('title')
    .optional()
    .isString().trim().notEmpty().withMessage('Title must be a non-empty string')
    .isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),
  body('content')
    .optional()
    .isString().withMessage('Content must be a string'),
  body('published')
    .optional()
    .isBoolean().withMessage('Published must be a boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
]; 