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