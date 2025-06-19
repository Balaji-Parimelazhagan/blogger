const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerValidator, updateProfileValidator } = require('../validators/userValidator');
const rateLimiter = require('../middleware/rateLimiter');
const auth = require('../middleware/auth');

// POST /users - Register
router.post('/', rateLimiter, registerValidator, userController.register);

// GET /users/me
router.get('/me', auth, userController.me);

// GET /users/:id
router.get('/:id', auth, userController.getProfile);

// PUT /users/:id
router.put('/:id', auth, updateProfileValidator, userController.updateProfile);

// PATCH /users/:id/avatar
router.patch('/:id/avatar', auth, userController.changeAvatar);

module.exports = router; 