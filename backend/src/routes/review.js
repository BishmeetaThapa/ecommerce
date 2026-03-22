const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    getAllReviews,
    updateReviewStatus
} = require('../controllers/review');

// Public routes
// GET /api/reviews/product/:productId - Get reviews for a product
router.get('/product/:productId', getProductReviews);

// Protected routes (authenticated users)
// POST /api/reviews - Create a new review
router.post('/', auth, createReview);

// PUT /api/reviews/:id - Update a review
router.put('/:id', auth, updateReview);

// DELETE /api/reviews/:id - Delete a review
router.delete('/:id', auth, deleteReview);

// POST /api/reviews/:id/helpful - Mark review as helpful
router.post('/:id/helpful', auth, markHelpful);

// Admin routes
// GET /api/reviews - Get all reviews (admin)
router.get('/', adminAuth, getAllReviews);

// PUT /api/reviews/:id/status - Update review status (admin)
router.put('/:id/status', adminAuth, updateReviewStatus);

module.exports = router;
