const express = require('express');
const router = express.Router({ mergeParams: true });
const relatedPostController = require('../controllers/relatedPostController');

// GET /posts/:post_id/related - List related posts for a given post
router.get('/', relatedPostController.listRelated);

module.exports = router; 