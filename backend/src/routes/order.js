const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/order');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
// Order creation now requires authentication
router.post('/', auth, createOrder);
router.get('/', getAllOrders);

// Protected routes - get own orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const Order = require('../models/order');
        const mongoose = require('mongoose');

        // Get user ID from the authenticated user
        let userId = req.user.id;
        console.log('Fetching orders for user:', userId, 'type:', typeof userId);

        // Convert to MongoDB ObjectId if needed
        let queryUserId = userId;
        if (userId && typeof userId === 'string') {
            try {
                queryUserId = new mongoose.Types.ObjectId(userId);
            } catch (e) {
                console.log('Could not convert to ObjectId');
            }
        }

        // Filter orders by user ID
        const orders = await Order.find({ user: queryUserId }).sort({ createdAt: -1 });
        console.log('Found orders count:', orders.length);

        // Map products to items for frontend compatibility
        const mappedOrders = orders.map(order => ({
            ...order.toObject(),
            items: order.products,
            id: order._id,
            status: order.status?.toUpperCase() || 'PENDING'
        }));

        res.json(mappedOrders);
    } catch (error) {
        console.error('Get my orders error:', error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

// Admin routes - all orders (public for admin panel)
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
