const express = require('express');
const router = express.Router();
const {
    getAllBrands,
    getBrandById,
    getBrandBySlug,
    createBrand,
    updateBrand,
    deleteBrand
} = require('../controllers/brand');
const { adminAuth } = require('../middleware/auth');

// Public routes
router.get('/', getAllBrands);
router.get('/:id', getBrandById);
router.get('/slug/:slug', getBrandBySlug);

// Admin routes (protected)
router.post('/', adminAuth, createBrand);
router.put('/:id', adminAuth, updateBrand);
router.delete('/:id', adminAuth, deleteBrand);

module.exports = router;
