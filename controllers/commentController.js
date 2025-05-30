const Comment = require('../models/comment');
const BlogPost = require('../models/blogPost');
const { validationResult } = require('express-validator');
const DOMPurify = require('isomorphic-dompurify');

exports.addComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { content } = req.body;
    const post = await BlogPost.findByPk(req.params.post_id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const cleanContent = DOMPurify.sanitize(content);
    const comment = await Comment.create({
      post_id: post.id,
      author_id: req.user.id,
      content: cleanContent,
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}; 