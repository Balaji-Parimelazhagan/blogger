const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginValidator } = require('../validators/authValidator');

// POST /auth/login
router.post('/login', loginValidator, authController.login);

module.exports = router; 