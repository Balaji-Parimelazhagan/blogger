const { body, validationResult } = require('express-validator');
const Tag = require('../models/tag');

exports.tagValidator = [
  body('name')
    .isString().trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 1, max: 30 }).withMessage('Name must be 1-30 characters')
    .custom(async (value) => {
      const tag = await Tag.findOne({ where: { name: value } });
      if (tag) throw new Error('Tag name must be unique');
      return true;
    }),
  body('slug')
    .isString().trim().notEmpty().withMessage('Slug is required')
    .isLength({ min: 1, max: 30 }).withMessage('Slug must be 1-30 characters')
    .matches(/^[a-z0-9-]+$/i).withMessage('Slug must be alphanumeric and dashes only')
    .custom(async (value) => {
      const tag = await Tag.findOne({ where: { slug: value } });
      if (tag) throw new Error('Tag slug must be unique');
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
]; 