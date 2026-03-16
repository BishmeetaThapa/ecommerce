const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Method to generate reset password token
userSchema.methods.generateResetPasswordToken = function () {
    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token and save to database
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiration time (15 minutes)
    this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    return resetToken; // Return unhashed token to send via email
};

module.exports = mongoose.model('User', userSchema);
