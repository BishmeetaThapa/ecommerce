const Order = require('../models/order');
const User = require('../models/user');

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
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

        res.json(order);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Error fetching order' });
    }
};

// Create new order
const createOrder = async (req, res) => {
    try {
        const { user, products, totalAmount, shippingAddress, paymentMethod } = req.body;

        const order = new Order({
            user,
            products,
            totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'cash on delivery'
        });

        await order.save();
        res.status(201).json(order);
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

        if (status) order.status = status;
        if (isPaid !== undefined) {
            order.isPaid = isPaid;
            if (isPaid) order.paidAt = Date.now();
        }
        order.updatedAt = Date.now();

        await order.save();
        res.json(order);
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
