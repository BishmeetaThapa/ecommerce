const Review = require('../models/review');
const Product = require('../models/product');
const Order = require('../models/order');

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Build sort object
        const sortObj = {};
        sortObj[sort] = order === 'desc' ? -1 : 1;

        const reviews = await Review.find({
            product: productId,
            status: 'APPROVED'
        })
            .populate('user', 'name avatar')
            .sort(sortObj)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Review.countDocuments({
            product: productId,
            status: 'APPROVED'
        });

        res.json({
            reviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get product reviews error:', error);
        res.status(500).json({ error: 'Error fetching reviews' });
    }
};

// Create a review
exports.createReview = async (req, res) => {
    try {
        const { productId, rating, title, comment } = req.body;
        const userId = req.user.id;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            product: productId,
            user: userId
        });

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }

        // Check if user purchased this product (verified purchase)
        const order = await Order.findOne({
            user: userId,
            'items.product': productId,
            status: { $in: ['DELIVERED', 'SHIPPED'] },
            paymentStatus: 'PAID'
        });

        const isVerifiedPurchase = !!order;

        // Create review
        const review = new Review({
            product: productId,
            user: userId,
            rating,
            title,
            comment,
            isVerifiedPurchase
        });

        await review.save();
        await review.populate('user', 'name avatar');

        res.status(201).json({
            message: 'Review created successfully',
            review
        });
    } catch (error) {
        console.error('Create review error:', error);
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }
        res.status(500).json({ error: 'Error creating review' });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, title, comment } = req.body;
        const userId = req.user.id;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if user owns the review
        if (review.user.toString() !== userId) {
            return res.status(403).json({ error: 'You can only update your own reviews' });
        }

        // Update fields
        if (rating) review.rating = rating;
        if (title !== undefined) review.title = title;
        if (comment !== undefined) review.comment = comment;

        await review.save();
        await review.populate('user', 'name avatar');

        res.json({
            message: 'Review updated successfully',
            review
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ error: 'Error updating review' });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if user owns the review or is admin
        if (review.user.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this review' });
        }

        await Review.findByIdAndDelete(id);

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ error: 'Error deleting review' });
    }
};

// Mark review as helpful
exports.markHelpful = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if user already marked as helpful
        const alreadyHelpful = review.helpful.includes(userId);

        if (alreadyHelpful) {
            // Remove helpful mark
            review.helpful = review.helpful.filter(h => h.toString() !== userId);
            review.helpfulCount = Math.max(0, review.helpfulCount - 1);
        } else {
            // Add helpful mark
            review.helpful.push(userId);
            review.helpfulCount += 1;
        }

        await review.save();

        res.json({
            message: alreadyHelpful ? 'Review unmarked as helpful' : 'Review marked as helpful',
            helpfulCount: review.helpfulCount
        });
    } catch (error) {
        console.error('Mark helpful error:', error);
        res.status(500).json({ error: 'Error marking review as helpful' });
    }
};

// Get all reviews (admin)
exports.getAllReviews = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, productId } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (productId) filter.product = productId;

        const reviews = await Review.find(filter)
            .populate('user', 'name email avatar')
            .populate('product', 'name slug')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Review.countDocuments(filter);

        res.json({
            reviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get all reviews error:', error);
        res.status(500).json({ error: 'Error fetching reviews' });
    }
};

// Update review status (admin)
exports.updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        review.status = status;
        await review.save();
        await review.populate('user', 'name avatar');
        await review.populate('product', 'name slug');

        res.json({
            message: 'Review status updated',
            review
        });
    } catch (error) {
        console.error('Update review status error:', error);
        res.status(500).json({ error: 'Error updating review status' });
    }
};
