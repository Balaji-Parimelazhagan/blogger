const { body, validationResult } = require('express-validator');

exports.registerValidator = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updateProfileValidator = [
  body('name').optional().isString().trim().notEmpty().withMessage('Name must be a non-empty string'),
  body('avatar_url').optional().isString().isLength({ max: 255 }).withMessage('Avatar URL must be a string'),
  body('bio').optional().isString().withMessage('Bio must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
]; 