const Brand = require('../models/brand');

// Get all brands
const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
        res.json(brands);
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

        const brand = await Brand.findById(id);
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        // Check for duplicates
        if (name && name !== brand.name) {
            const nameExists = await Brand.findOne({ name });
            if (nameExists) {
                return res.status(400).json({ error: 'Brand with this name already exists' });
            }
        }

        if (slug && slug !== brand.slug) {
            const slugExists = await Brand.findOne({ slug });
            if (slugExists) {
                return res.status(400).json({ error: 'Brand with this slug already exists' });
            }
        }

        brand.name = name || brand.name;
        brand.slug = slug || brand.slug;
        brand.description = description !== undefined ? description : brand.description;
        brand.logo = logo !== undefined ? logo : brand.logo;
        brand.website = website !== undefined ? website : brand.website;
        if (isActive !== undefined) brand.isActive = isActive;
        brand.updatedAt = Date.now();

        await brand.save();
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

        const brand = await Brand.findById(id);
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        brand.isActive = false;
        brand.updatedAt = Date.now();
        await brand.save();

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
