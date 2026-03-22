const Order = require('../models/order');
const User = require('../models/user');
const mongoose = require('mongoose');

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        // Map products to items for frontend compatibility
        const mappedOrders = orders.map(order => ({
            ...order.toObject(),
            items: order.products,
            id: order._id,
            status: order.status?.toUpperCase() || 'PENDING'
        }));

        res.json(mappedOrders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Map products to items for frontend compatibility
        const mappedOrder = {
            ...order.toObject(),
            items: order.products,
            id: order._id
        };

        res.json(mappedOrder);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Error fetching order' });
    }
};

// Create new order
const createOrder = async (req, res) => {
    try {
        // Get user from auth token (more secure)
        const userId = req.user ? req.user.id : null;
        console.log('Creating order for user:', userId);

        const { items, totalAmount, shippingAddress, paymentMethod, status } = req.body;

        // Accept both 'items' and 'products' for compatibility
        const orderItems = items || req.body.products;

        // Format products to match schema - convert productId to product field
        const products = orderItems ? orderItems.map((item) => ({
            product: item.productId || item.product || null,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        })) : [];

        const order = new Order({
            user: userId,
            products,
            totalAmount: Number(totalAmount) || 0,
            shippingAddress,
            paymentMethod: paymentMethod || 'cash on delivery',
            status: (status || 'pending').toLowerCase(),
            isPaid: paymentMethod && paymentMethod !== 'cod' && paymentMethod !== 'cash on delivery' ? true : false,
            paidAt: paymentMethod && paymentMethod !== 'cod' && paymentMethod !== 'cash on delivery' ? Date.now() : undefined
        });

        await order.save();
        console.log('Order saved with ID:', order._id, 'User:', order.user);

        // Return with mapped items field
        res.status(201).json({
            ...order.toObject(),
            items: order.products,
            id: order._id,
            status: order.status?.toUpperCase() || 'PENDING'
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Error creating order' });
    }
};

// Update order status
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, isPaid } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (status) order.status = status.toLowerCase();
        if (isPaid !== undefined) {
            order.isPaid = isPaid;
            if (isPaid) order.paidAt = Date.now();
        }
        order.updatedAt = Date.now();

        await order.save();

        // Return with mapped items field
        res.json({
            ...order.toObject(),
            items: order.products,
            id: order._id,
            status: order.status?.toUpperCase() || 'PENDING'
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ error: 'Error updating order' });
    }
};

// Delete order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        await Order.findByIdAndDelete(id);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({ error: 'Error deleting order' });
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
