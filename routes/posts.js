const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const { createPostValidator } = require('../validators/blogPostValidator');
const auth = require('../middleware/auth');

// POST /posts - Create a new blog post
router.post('/', auth, createPostValidator, blogPostController.createPost);

module.exports = router; 