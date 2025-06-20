const { body, validationResult } = require('express-validator');

exports.createPostValidator = [
  body('title')
    .exists().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),
  body('content')
    .exists().withMessage('Content is required')
    .isString().withMessage('Content must be a string')
    .notEmpty().withMessage('Content cannot be empty'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      return res.status(400).json({ error: firstError.msg });
    }
    next();
  },
];

exports.updatePostValidator = [
  body('title')
    .optional()
    .isString().withMessage('Title must be a string')
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),
  body('content')
    .optional()
    .isString().withMessage('Content must be a string')
    .notEmpty().withMessage('Content cannot be empty'),
  body('published')
    .optional()
    .isBoolean().withMessage('Published must be a boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      return res.status(400).json({ error: firstError.msg });
    }
    next();
  },
]; 