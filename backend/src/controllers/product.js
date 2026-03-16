const Product = require('../models/product');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true })
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Error fetching product' });
    }
};

// Get product by slug
const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await Product.findOne({ slug });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Error fetching product' });
    }
};

// Create new product
const createProduct = async (req, res) => {
    try {
        const { name, slug, description, price, stock, category, brand, images } = req.body;

        // Check if product with slug already exists
        const existingProduct = await Product.findOne({ slug });
        if (existingProduct) {
            return res.status(400).json({ error: 'Product with this slug already exists' });
        }

        const product = new Product({
            name,
            slug,
            description,
            price,
            stock,
            category,
            brand,
            images: images || []
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Error creating product' });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description, price, stock, category, brand, images, isActive } = req.body;

        // Check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if new slug conflicts with another product
        if (slug && slug !== product.slug) {
            const slugExists = await Product.findOne({ slug });
            if (slugExists) {
                return res.status(400).json({ error: 'Product with this slug already exists' });
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name: name || product.name,
                slug: slug || product.slug,
                description: description || product.description,
                price: price || product.price,
                stock: stock || product.stock,
                category: category || product.category,
                brand: brand || product.brand,
                images: images || product.images,
                isActive: isActive !== undefined ? isActive : product.isActive,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Error updating product' });
    }
};

// Delete product (soft delete)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Soft delete - just set isActive to false
        product.isActive = false;
        product.updatedAt = Date.now();
        await product.save();

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Error fetching categories' });
    }
};

// Get all brands
const getAllBrands = async (req, res) => {
    try {
        const brands = await Product.distinct('brand');
        res.json(brands.filter(brand => brand)); // Filter out empty strings
    } catch (error) {
        console.error('Get brands error:', error);
        res.status(500).json({ error: 'Error fetching brands' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllCategories,
    getAllBrands
};
