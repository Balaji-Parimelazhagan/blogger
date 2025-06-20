const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerValidator, userUpdateValidator, validate, passwordUpdateValidator } = require('../validators/userValidator');
const rateLimiter = require('../middleware/rateLimiter');
const auth = require('../middleware/auth');

// POST /users - Register
router.post('/', rateLimiter, registerValidator, userController.register);

// GET /users/me
router.get('/me', auth, userController.me);

// GET /users/:id
router.get('/:id', userController.getProfile);

// PUT /users/:id
router.put('/:id', auth, userUpdateValidator, validate, userController.updateProfile);

// PATCH /users/:id/avatar
router.patch('/:id/avatar', auth, userController.changeAvatar);

// Password Update
router.put('/:id/password', auth, passwordUpdateValidator, validate, userController.updatePassword);

module.exports = router; 