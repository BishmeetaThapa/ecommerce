const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        maxlength: 200
    },
    comment: {
        type: String,
        maxlength: 1000
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    helpful: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    helpfulCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'APPROVED'
    }
}, {
    timestamps: true
});

// Prevent duplicate reviews - one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update product rating after save
reviewSchema.post('save', async function () {
    const Review = this.constructor;
    const Product = require('./product');

    const stats = await Review.aggregate([
        { $match: { product: this.product, status: 'APPROVED' } },
        {
            $group: {
                _id: '$product',
                avgRating: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(this.product, {
            rating: Math.round(stats[0].avgRating * 10) / 10,
            reviewCount: stats[0].count
        });
    }
});

// Update product rating after delete
reviewSchema.post('deleteOne', { document: true }, async function () {
    const Review = this.constructor;
    const Product = require('./product');

    const stats = await Review.aggregate([
        { $match: { product: this.product, status: 'APPROVED' } },
        {
            $group: {
                _id: '$product',
                avgRating: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(this.product, {
            rating: Math.round(stats[0].avgRating * 10) / 10,
            reviewCount: stats[0].count
        });
    } else {
        await Product.findByIdAndUpdate(this.product, {
            rating: 0,
            reviewCount: 0
        });
    }
});

module.exports = mongoose.model('Review', reviewSchema);
