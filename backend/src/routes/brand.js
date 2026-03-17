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
router.post('/', createBrand);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

module.exports = router;
