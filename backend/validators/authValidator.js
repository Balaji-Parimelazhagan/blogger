const { body, validationResult } = require('express-validator');

exports.loginValidator = [
  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .exists().withMessage('Password is required')
    .isString().withMessage('Password must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  },
];