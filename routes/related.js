const express = require('express');
const router = express.Router({ mergeParams: true });
const relatedPostController = require('../controllers/relatedPostController');
const auth = require('../middleware/auth');

// GET /posts/:post_id/related - List related posts for a given post
router.get('/', relatedPostController.listRelated);

// POST /posts/:post_id/related - Add related post (author only)
router.post('/', auth, relatedPostController.addRelated);

// DELETE /posts/:post_id/related/:related_post_id - Remove related post (author only)
router.delete('/:related_post_id', auth, relatedPostController.removeRelated);

module.exports = router; 