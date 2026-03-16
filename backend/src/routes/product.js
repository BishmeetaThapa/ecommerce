const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllCategories,
    getAllBrands
} = require('../controllers/product');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getAllCategories);
router.get('/brands', getAllBrands);
router.get('/:id', getProductById);
router.get('/slug/:slug', getProductBySlug);

// Admin routes (protected)
router.post('/', adminAuth, createProduct);
router.put('/:id', adminAuth, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;
