const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerValidator } = require('../validators/userValidator');
const rateLimiter = require('../middleware/rateLimiter');

// POST /users - Register
router.post('/', rateLimiter, registerValidator, userController.register);

// GET /users/:id
router.get('/:id', userController.getProfile);

module.exports = router; 