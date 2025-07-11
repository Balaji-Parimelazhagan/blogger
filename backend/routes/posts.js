const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const { createPostValidator } = require('../validators/blogPostValidator');
const auth = require('../middleware/auth');

// POST /posts - Create a new blog post
router.post('/', auth, createPostValidator, blogPostController.createPost);

// GET /posts - List blog posts
router.get('/', blogPostController.listPosts);

// Optional auth middleware for GET /posts/:id
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return auth(req, res, next);
  }
  next();
};

// GET /posts/:id - Get blog post by ID
router.get('/:id', blogPostController.getPost);

// PUT /posts/:id - Update blog post (author only)
router.put('/:id', auth, require('../validators/blogPostValidator').updatePostValidator, blogPostController.updatePost);

// DELETE /posts/:id - Delete blog post (author only)
router.delete('/:id', auth, blogPostController.deletePost);

// Mount comments router
router.use('/:post_id/comments', require('./comments'));

// Mount related posts router
router.use('/:post_id/related', require('./related'));

// Tagging endpoints for posts
router.get('/:id/tags', auth, blogPostController.listTagsForPost);
router.post('/:id/tags', auth, blogPostController.addTagToPost);
router.delete('/:id/tags', auth, blogPostController.removeTagFromPost);

module.exports = router; 