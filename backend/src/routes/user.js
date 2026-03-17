const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, updateProfile, forgotPassword, resetPassword } = require('../controllers/auth');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/user');
const mongoose = require('mongoose');

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

// Update current user profile (protected route)
router.put('/me', auth, updateProfile);

// Admin routes - Get all users (public for admin panel)
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Admin routes - Get user by ID (public for settings page)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

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

// Admin routes - Update user role (public for admin panel)
router.put('/:id/role', async (req, res) => {
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

// Admin routes - Update user (public for admin panel)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const { role, name, email, phone, bio, darkMode, notifications } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (role) user.role = role;
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (bio !== undefined) user.bio = bio;
        if (darkMode !== undefined) user.darkMode = darkMode;
        if (notifications !== undefined) user.notifications = notifications;
        await user.save();

        res.json({
            message: 'User updated',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                bio: user.bio,
                darkMode: user.darkMode,
                notifications: user.notifications,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        // Return more specific error message
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        res.status(500).json({ error: 'Error updating user: ' + error.message });
    }
});

// Admin routes - Update user password
router.put('/:id/password', async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.password = password;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ error: 'Error updating password: ' + error.message });
    }
});

// Admin routes - Delete user (public for admin panel)
router.delete('/:id', async (req, res) => {
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
