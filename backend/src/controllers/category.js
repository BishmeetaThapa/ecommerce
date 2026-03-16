const Category = require('../models/category');

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });
        res.json(categories);
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
        const { name, slug, description, image } = req.body;

        // Check if category already exists
        const existingCategory = await Category.findOne({ $or: [{ name }, { slug }] });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category with this name or slug already exists' });
        }

        const category = new Category({
            name,
            slug,
            description,
            image
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
        const { name, slug, description, image, isActive } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check for duplicates
        if (name && name !== category.name) {
            const nameExists = await Category.findOne({ name });
            if (nameExists) {
                return res.status(400).json({ error: 'Category with this name already exists' });
            }
        }

        if (slug && slug !== category.slug) {
            const slugExists = await Category.findOne({ slug });
            if (slugExists) {
                return res.status(400).json({ error: 'Category with this slug already exists' });
            }
        }

        category.name = name || category.name;
        category.slug = slug || category.slug;
        category.description = description !== undefined ? description : category.description;
        category.image = image !== undefined ? image : category.image;
        if (isActive !== undefined) category.isActive = isActive;
        category.updatedAt = Date.now();

        await category.save();
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

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        category.isActive = false;
        category.updatedAt = Date.now();
        await category.save();

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
