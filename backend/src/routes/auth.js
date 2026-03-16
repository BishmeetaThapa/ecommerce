const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, forgotPassword, resetPassword } = require('../controllers/auth');
const { auth } = require('../middleware/auth');

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Forgot password - request reset link
router.post('/forgot-password', forgotPassword);

// Reset password - with token
router.post('/reset-password', resetPassword);

// Get current user (protected route)
router.get('/me', auth, getCurrentUser);

module.exports = router;
