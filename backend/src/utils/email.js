const nodemailer = require('nodemailer');

// Create transporter based on environment configuration
const createTransporter = () => {
    // Check if email configuration exists
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = process.env.EMAIL_PORT;
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    // If no email config, return null transporter (for development without email)
    if (!emailHost || !emailUser || !emailPass) {
        console.warn('⚠️  Email configuration not found. Emails will be logged only.');
        return null;
    }

    return nodemailer.createTransport({
        host: emailHost,
        port: parseInt(emailPort) || 587,
        secure: parseInt(emailPort) === 465, // true for 465, false for other ports
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, userName) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"EverGlow Beauty" <noreply@everglow.com>',
        to: email,
        subject: '🔐 Password Reset Request - EverGlow Beauty',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
                    <tr>
                        <td align="center">
                            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; overflow: hidden;">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #ec4899, #f43f5e); padding: 30px; text-align: center;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">EverGlow Beauty</h1>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
                                        
                                        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                            Hi <strong>${userName}</strong>,
                                        </p>
                                        
                                        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                            We received a request to reset your password. Click the button below to create a new password:
                                        </p>
                                        
                                        <!-- CTA Button -->
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center">
                                                    <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #ec4899, #f43f5e); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-size: 16px; font-weight: bold;">
                                                        Reset Password
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 20px 0;">
                                            This link will expire in <strong>1 hour</strong>.
                                        </p>
                                        
                                        <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
                                            If you didn't request this, please ignore this email. Your password will remain unchanged.
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center;">
                                        <p style="color: #999999; font-size: 12px; margin: 0;">
                                            © ${new Date().getFullYear()} EverGlow Beauty. All rights reserved.
                                        </p>
                                        <p style="color: #cccccc; font-size: 11px; margin: 10px 0 0 0;">
                                            This is an automated email. Please do not reply directly.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `
    };

    try {
        if (transporter) {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Password reset email sent to: ${email}`);
            return { success: true };
        } else {
            // Development mode - log email content
            console.log('📧 [DEV MODE] Password Reset Email:');
            console.log(`   To: ${email}`);
            console.log(`   Link: ${resetLink}`);
            return { success: true, devMode: true };
        }
    } catch (error) {
        console.error('❌ Error sending password reset email:', error.message);
        return { success: false, error: error.message };
    }
};

// Send welcome email
const sendWelcomeEmail = async (email, userName) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"EverGlow Beauty" <noreply@everglow.com>',
        to: email,
        subject: '🎉 Welcome to EverGlow Beauty!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
                    <tr>
                        <td align="center">
                            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 10px;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #ec4899, #f43f5e); padding: 30px; text-align: center;">
                                        <h1 style="color: #ffffff; margin: 0;">EverGlow Beauty</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="color: #333;">Welcome, ${userName}! 🎉</h2>
                                        <p style="color: #666; line-height: 1.6;">
                                            Thank you for joining EverGlow Beauty. We're excited to have you!
                                        </p>
                                        <p style="color: #666; line-height: 1.6;">
                                            Start exploring our premium skincare and makeup products.
                                        </p>
                                        <a href="http://localhost:3000" style="display: inline-block; background: #ec4899; color: #ffffff; padding: 12px 30px; border-radius: 25px; text-decoration: none; margin-top: 20px;">
                                            Shop Now
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `
    };

    try {
        if (transporter) {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Welcome email sent to: ${email}`);
            return { success: true };
        } else {
            console.log('📧 [DEV MODE] Welcome Email would be sent to:', email);
            return { success: true, devMode: true };
        }
    } catch (error) {
        console.error('❌ Error sending welcome email:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendWelcomeEmail
};
