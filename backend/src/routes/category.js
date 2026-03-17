const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/category');
const { adminAuth } = require('../middleware/auth');

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.get('/slug/:slug', getCategoryBySlug);

// Admin routes (protected)
router.post('/', adminAuth, createCategory);
router.put('/:id', adminAuth, updateCategory);
router.delete('/:id', adminAuth, deleteCategory);

module.exports = router;
