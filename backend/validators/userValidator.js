const { body, validationResult } = require('express-validator');

exports.registerValidator = [
  body('name')
    .exists().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ max: 100 }).withMessage('Name too long (max 100 characters)'),
  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email too long (max 255 characters)'),
  body('password')
    .exists().withMessage('Password is required')
    .isString().withMessage('Password must be a string')
    .isLength({ min: 8, max: 100 }).withMessage('Password must be between 8 and 100 characters'),
];

exports.userUpdateValidator = [
  body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ max: 100 }).withMessage('Name too long (max 100 characters)'),
  body('avatar_url')
    .optional()
    .isString().withMessage('Avatar URL must be a string')
    .isLength({ max: 255 }).withMessage('Avatar URL too long (max 255 characters)'),
  body('bio')
    .optional()
    .isString().withMessage('Bio must be a string'),
];

exports.passwordUpdateValidator = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}; 