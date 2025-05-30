const BlogPost = require('../models/blogPost');
const { validationResult } = require('express-validator');
const DOMPurify = require('isomorphic-dompurify');

exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, content, published } = req.body;
    // Sanitize content to prevent XSS
    const cleanContent = DOMPurify.sanitize(content);
    const post = await BlogPost.create({
      title,
      content: cleanContent,
      published: published === true,
      author_id: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.listPosts = async (req, res, next) => {
  try {
    const {
      author_id,
      published,
      limit = 20,
      offset = 0,
      sortBy = 'created_at',
      order = 'desc',
    } = req.query;

    const where = {};
    if (author_id) where.author_id = author_id;
    if (published !== undefined) where.published = published === 'true';
    else where.published = true; // default: only published

    const posts = await BlogPost.findAll({
      where,
      limit: Math.min(Number(limit), 100),
      offset: Number(offset),
      order: [[sortBy, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']],
    });
    res.json(posts);
  } catch (err) {
    next(err);
  }
}; 