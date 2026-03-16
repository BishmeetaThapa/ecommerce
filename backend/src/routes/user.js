const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, forgotPassword, resetPassword } = require('../controllers/auth');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/user');

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

// Admin routes - Get all users
router.get('/', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Admin routes - Get user by ID
router.get('/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// Admin routes - Update user role
router.put('/:id/role', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({ message: 'User role updated', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({ error: 'Error updating user role' });
    }
});

// Admin routes - Delete user
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

module.exports = router;
