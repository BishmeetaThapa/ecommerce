const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { JWT_SECRET } = require('../middleware/auth');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../utils/email');

// Register new user
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate role - only allow 'admin' or 'customer'
        const validRoles = ['admin', 'customer'];
        const userRole = role && validRoles.includes(role) ? role : 'customer';

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: userRole
        });

        await user.save();

        // Send welcome email (async - don't wait for it)
        sendWelcomeEmail(email, name).catch(err => console.error('Welcome email error:', err));

        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Return with 'id' instead of '_id' for consistency
        res.json({
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            bio: user.bio,
            avatar: user.avatar,
            role: user.role,
            darkMode: user.darkMode,
            notifications: user.notifications,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Error getting user' });
    }
};

// Update current user profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, bio, avatar } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (bio !== undefined) user.bio = bio;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        // Return user without password
        const updatedUser = await User.findById(user._id).select('-password');
        res.json(updatedUser);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
};

// Forgot password - send reset link
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Find user by email
        const user = await User.findOne({ email });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({
                message: 'If an account exists with this email, a password reset link has been sent.'
            });
        }

        // Generate reset token
        const resetToken = user.generateResetPasswordToken();
        await user.save();

        // Send password reset email
        const emailResult = await sendPasswordResetEmail(email, resetToken, user.name);

        // Always return success to prevent email enumeration
        // In development mode, include token for testing
        const response = {
            message: 'If an account exists with this email, a password reset link has been sent.'
        };

        // Include reset link in development only
        if (process.env.NODE_ENV !== 'production' && emailResult.devMode) {
            response.resetToken = resetToken;
            response.resetLink = 'http://localhost:3000/reset-password?token=' + resetToken;
            response.devMode = true;
        }

        res.json(response);
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Error processing forgot password request' });
    }
};

// Reset password with token
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Hash the token to compare with database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token and not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: 'Password reset successfully. You can now login with your new password.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Error resetting password' });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    updateProfile,
    forgotPassword,
    resetPassword
};
