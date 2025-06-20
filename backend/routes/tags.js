const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { tagValidator } = require('../validators/tagValidator');
const auth = require('../middleware/auth');

// GET /tags - List all tags
router.get('/', tagController.listTags);

// POST /tags - Create a new tag
router.post('/', auth, tagValidator, tagController.createTag);

// GET /tags/:id - Get tag details
router.get('/:id', tagController.getTag);

// DELETE /tags/:id - Delete a tag
router.delete('/:id', auth, tagController.deleteTag);

module.exports = router; 