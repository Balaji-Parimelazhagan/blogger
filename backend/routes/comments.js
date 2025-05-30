const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const { addCommentValidator } = require('../validators/commentValidator');
const auth = require('../middleware/auth');

// POST /posts/:post_id/comments - Add a comment to a post
router.post('/', auth, addCommentValidator, commentController.addComment);

// GET /posts/:post_id/comments - List comments for a post
router.get('/', commentController.listComments);

module.exports = router; 