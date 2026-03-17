const Category = require('../models/category');
const Product = require('../models/product');

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });

        // Get product count for each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
                const productCount = await Product.countDocuments({
                    $or: [
                        { category: cat.name },
                        { category: cat._id.toString() }
                    ],
                    isActive: true
                });
                return {
                    ...cat.toObject(),
                    productCount
                };
            })
        );

        res.json(categoriesWithCount);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Error fetching categories' });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ error: 'Error fetching category' });
    }
};

// Get category by slug
const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ error: 'Error fetching category' });
    }
};

// Create new category
const createCategory = async (req, res) => {
    try {
        const { name, slug, description, image, productCount } = req.body;

        // Check if category already exists
        const existingCategory = await Category.findOne({ $or: [{ name }, { slug }] });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category with this name or slug already exists' });
        }

        const category = new Category({
            name,
            slug,
            description,
            image,
            productCount: productCount || 0
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ error: 'Error creating category' });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description, image, productCount, isActive } = req.body;

        const updateData = {}
        if (name !== undefined) updateData.name = name
        if (slug !== undefined) updateData.slug = slug
        if (description !== undefined) updateData.description = description
        if (image !== undefined) updateData.image = image
        if (productCount !== undefined) updateData.productCount = Number(productCount)
        if (isActive !== undefined) updateData.isActive = isActive
        updateData.updatedAt = Date.now()

        const category = await Category.findByIdAndUpdate(id, updateData, { new: true });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ error: 'Error updating category' });
    }
};

// Delete category (soft delete)
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndUpdate(
            id,
            { isActive: false, updatedAt: Date.now() },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ error: 'Error deleting category' });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
};
