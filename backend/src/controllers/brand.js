const Brand = require('../models/brand');
const Product = require('../models/product');

// Get all brands
const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find({ isActive: true }).sort({ name: 1 });

        // Get product count for each brand
        const brandsWithCount = await Promise.all(
            brands.map(async (brand) => {
                const productCount = await Product.countDocuments({
                    $or: [
                        { brand: brand.name },
                        { brand: brand._id.toString() }
                    ],
                    isActive: true
                });
                return {
                    ...brand.toObject(),
                    productCount
                };
            })
        );

        res.json(brandsWithCount);
    } catch (error) {
        console.error('Get brands error:', error);
        res.status(500).json({ error: 'Error fetching brands' });
    }
};

// Get brand by ID
const getBrandById = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await Brand.findById(id);

        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        res.json(brand);
    } catch (error) {
        console.error('Get brand error:', error);
        res.status(500).json({ error: 'Error fetching brand' });
    }
};

// Get brand by slug
const getBrandBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const brand = await Brand.findOne({ slug });

        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        res.json(brand);
    } catch (error) {
        console.error('Get brand error:', error);
        res.status(500).json({ error: 'Error fetching brand' });
    }
};

// Create new brand
const createBrand = async (req, res) => {
    try {
        const { name, slug, description, logo, website } = req.body;

        // Check if brand already exists
        const existingBrand = await Brand.findOne({ $or: [{ name }, { slug }] });
        if (existingBrand) {
            return res.status(400).json({ error: 'Brand with this name or slug already exists' });
        }

        const brand = new Brand({
            name,
            slug,
            description,
            logo,
            website
        });

        await brand.save();
        res.status(201).json(brand);
    } catch (error) {
        console.error('Create brand error:', error);
        res.status(500).json({ error: 'Error creating brand' });
    }
};

// Update brand
const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description, logo, website, isActive } = req.body;

        const updateData = {}
        if (name !== undefined) updateData.name = name
        if (slug !== undefined) updateData.slug = slug
        if (description !== undefined) updateData.description = description
        if (logo !== undefined) updateData.logo = logo
        if (website !== undefined) updateData.website = website
        if (isActive !== undefined) updateData.isActive = isActive
        updateData.updatedAt = Date.now()

        const brand = await Brand.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });

        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        res.json(brand);
    } catch (error) {
        console.error('Update brand error:', error);
        res.status(500).json({ error: 'Error updating brand' });
    }
};

// Delete brand (soft delete)
const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        const brand = await Brand.findByIdAndUpdate(
            id,
            { isActive: false, updatedAt: Date.now() },
            { returnDocument: 'after' }
        );

        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        res.json({ message: 'Brand deleted successfully' });
    } catch (error) {
        console.error('Delete brand error:', error);
        res.status(500).json({ error: 'Error deleting brand' });
    }
};

module.exports = {
    getAllBrands,
    getBrandById,
    getBrandBySlug,
    createBrand,
    updateBrand,
    deleteBrand
};
