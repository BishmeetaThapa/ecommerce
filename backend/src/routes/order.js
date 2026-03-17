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
router.post('/', createOrder);
router.get('/', getAllOrders);

// Protected routes - get own orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const Order = require('../models/order');
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(orders);
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
