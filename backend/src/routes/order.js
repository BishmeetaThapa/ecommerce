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

// Public routes - create order
router.post('/', createOrder);

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

// Admin routes - all orders
router.get('/', adminAuth, getAllOrders);
router.get('/:id', adminAuth, getOrderById);
router.put('/:id', adminAuth, updateOrder);
router.delete('/:id', adminAuth, deleteOrder);

module.exports = router;
