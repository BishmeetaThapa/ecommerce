const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Define Schemas inline
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    website: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    category: { type: String, required: true },
    brand: { type: String, default: '' },
    images: [{ url: String, isPrimary: { type: Boolean, default: false } }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create Models
const Category = mongoose.model('Category', categorySchema);
const Brand = mongoose.model('Brand', brandSchema);
const Product = mongoose.model('Product', productSchema);

// Beauty Categories
const beautyCategories = [
    {
        name: 'Skincare',
        slug: 'skincare',
        description: 'Premium skincare products for radiant, healthy skin',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'
    },
    {
        name: 'Makeup',
        slug: 'makeup',
        description: 'Professional makeup products for every occasion',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'
    },
    {
        name: 'Hair Care',
        slug: 'hair-care',
        description: 'Luxurious hair care products for beautiful locks',
        image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400'
    },
    {
        name: 'Fragrances',
        slug: 'fragrances',
        description: 'Exquisite perfumes and fragrances',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'
    },
    {
        name: 'Bath & Body',
        slug: 'bath-body',
        description: 'Relaxing bath and body products for self-care',
        image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400'
    }
];

// Beauty Brands
const beautyBrands = [
    {
        name: 'LuxeGlow',
        slug: 'luxeglow',
        description: 'Premium skincare and makeup brand',
        logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200',
        website: 'https://luxeglow.com'
    },
    {
        name: 'SilkenSilk',
        slug: 'silkensilk',
        description: 'Luxury hair care products',
        logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200',
        website: 'https://silkensilk.com'
    },
    {
        name: 'VelvetKiss',
        slug: 'velvetkiss',
        description: 'Romantic fragrances and beauty products',
        logo: 'https://images.unsplash.com/photo-1616091216791-a5360a5fc31a?w=200',
        website: 'https://velvetkiss.com'
    },
    {
        name: 'AquaBloom',
        slug: 'aquabloom',
        description: 'Natural and organic beauty products',
        logo: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200',
        website: 'https://aquabloom.com'
    },
    {
        name: 'GoldenHour',
        slug: 'goldenhour',
        description: 'Professional makeup for beauty enthusiasts',
        logo: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200',
        website: 'https://goldenhour.com'
    }
];

// Beauty Products
const beautyProducts = [
    // Skincare Products
    {
        name: 'Radiance Vitamin C Serum',
        slug: 'radiance-vitamin-c-serum',
        description: 'Brightening vitamin C serum with antioxidants for glowing skin. Reduces dark spots and evens skin tone.',
        price: 49.99,
        stock: 100,
        category: 'Skincare',
        brand: 'LuxeGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', isPrimary: true }]
    },
    {
        name: 'HydraLift Moisturizer',
        slug: 'hydralift-moisturizer',
        description: 'Deep hydrating moisturizer with hyaluronic acid. Plumps and firms skin for youthful appearance.',
        price: 39.99,
        stock: 150,
        category: 'Skincare',
        brand: 'LuxeGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400', isPrimary: true }]
    },
    {
        name: 'Night Repair Cream',
        slug: 'night-repair-cream',
        description: 'Intensive overnight treatment with retinol and peptides. Repairs and regenerates skin while you sleep.',
        price: 59.99,
        stock: 80,
        category: 'Skincare',
        brand: 'AquaBloom',
        images: [{ url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', isPrimary: true }]
    },
    {
        name: 'Gentle Foam Cleanser',
        slug: 'gentle-foam-cleanser',
        description: 'pH-balanced gentle foam cleanser that removes impurities without stripping natural oils.',
        price: 24.99,
        stock: 200,
        category: 'Skincare',
        brand: 'AquaBloom',
        images: [{ url: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400', isPrimary: true }]
    },
    {
        name: 'SPF 50 Glow Sunscreen',
        slug: 'spf-50-glow-sunscreen',
        description: 'Lightweight SPF 50 sunscreen with subtle glow. Protects against UV rays while giving radiant finish.',
        price: 32.99,
        stock: 180,
        category: 'Skincare',
        brand: 'GoldenHour',
        images: [{ url: 'https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=400', isPrimary: true }]
    },

    // Makeup Products
    {
        name: 'Velvet Matte Lipstick Collection',
        slug: 'velvet-matte-lipstick-collection',
        description: 'Set of 6 velvet matte lipsticks in trending shades. Long-lasting and comfortable wear.',
        price: 44.99,
        stock: 120,
        category: 'Makeup',
        brand: 'GoldenHour',
        images: [{ url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', isPrimary: true }]
    },
    {
        name: 'Pro HD Foundation',
        slug: 'pro-hd-foundation',
        description: 'Full coverage HD foundation with natural finish. Suitable for all skin types.',
        price: 38.99,
        stock: 90,
        category: 'Makeup',
        brand: 'GoldenHour',
        images: [{ url: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400', isPrimary: true }]
    },
    {
        name: 'Volumizing Mascara',
        slug: 'volumizing-mascara',
        description: 'Dramatic volumizing mascara with intense black formula. Clump-free and lengthening.',
        price: 22.99,
        stock: 200,
        category: 'Makeup',
        brand: 'GoldenHour',
        images: [{ url: 'https://images.unsplash.com/photo-1631214540553-ab2016c02404?w=400', isPrimary: true }]
    },
    {
        name: 'Glowing Highlighter Palette',
        slug: 'glowing-highlighter-palette',
        description: '4-shade highlighter palette with pearl and matte finishes. Creates natural glow.',
        price: 34.99,
        stock: 150,
        category: 'Makeup',
        brand: 'LuxeGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', isPrimary: true }]
    },
    {
        name: 'Silk Setting Spray',
        slug: 'silk-setting-spray',
        description: 'Long-lasting setting spray that keeps makeup fresh for 16 hours. Hydrating formula.',
        price: 28.99,
        stock: 160,
        category: 'Makeup',
        brand: 'LuxeGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400', isPrimary: true }]
    },

    // Hair Care Products
    {
        name: 'Argan Oil Hair Serum',
        slug: 'argan-oil-hair-serum',
        description: 'Moroccan argan oil serum that tames frizz and adds shine. Lightweight formula.',
        price: 29.99,
        stock: 140,
        category: 'Hair Care',
        brand: 'SilkenSilk',
        images: [{ url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', isPrimary: true }]
    },
    {
        name: 'Keratin Shampoo',
        slug: 'keratin-shampoo',
        description: 'Keratin-infused shampoo that strengthens and repairs damaged hair.',
        price: 24.99,
        stock: 180,
        category: 'Hair Care',
        brand: 'SilkenSilk',
        images: [{ url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400', isPrimary: true }]
    },
    {
        name: 'Deep Conditioning Mask',
        slug: 'deep-conditioning-mask',
        description: 'Intensive weekly hair mask with coconut oil and honey. Restores moisture and luster.',
        price: 32.99,
        stock: 100,
        category: 'Hair Care',
        brand: 'SilkenSilk',
        images: [{ url: 'https://images.unsplash.com/photo-1585232569525-f087bd9dae8e?w=400', isPrimary: true }]
    },
    {
        name: 'Volume Boost Mousse',
        slug: 'volume-boost-mousse',
        description: 'Lightweight volumizing mousse that adds body without stiffness.',
        price: 19.99,
        stock: 150,
        category: 'Hair Care',
        brand: 'SilkenSilk',
        images: [{ url: 'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?w=400', isPrimary: true }]
    },

    // Fragrances
    {
        name: 'Midnight Rose Eau de Parfum',
        slug: 'midnight-rose-eau-de-parfum',
        description: 'Intoxicating floral fragrance with notes of rose, jasmine, and sandalwood.',
        price: 89.99,
        stock: 60,
        category: 'Fragrances',
        brand: 'VelvetKiss',
        images: [{ url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', isPrimary: true }]
    },
    {
        name: 'Ocean Breeze Cologne',
        slug: 'ocean-breeze-cologne',
        description: 'Fresh aquatic fragrance with citrus and marine notes. Perfect for everyday wear.',
        price: 54.99,
        stock: 80,
        category: 'Fragrances',
        brand: 'VelvetKiss',
        images: [{ url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400', isPrimary: true }]
    },
    {
        name: 'Vanilla Dream Perfume',
        slug: 'vanilla-dream-perfume',
        description: 'Warm vanilla fragrance with notes of amber and musk. Cozy and inviting.',
        price: 64.99,
        stock: 70,
        category: 'Fragrances',
        brand: 'VelvetKiss',
        images: [{ url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', isPrimary: true }]
    },

    // Bath & Body
    {
        name: 'Luxury Bath Bomb Set',
        slug: 'luxury-bath-bomb-set',
        description: 'Set of 6 handmade bath bombs with essential oils. Fizzies and moisturizes skin.',
        price: 28.99,
        stock: 120,
        category: 'Bath & Body',
        brand: 'AquaBloom',
        images: [{ url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400', isPrimary: true }]
    },
    {
        name: 'Shea Butter Body Lotion',
        slug: 'shea-butter-body-lotion',
        description: 'Rich body lotion with shea butter and vitamin E. Deeply moisturizing.',
        price: 26.99,
        stock: 160,
        category: 'Bath & Body',
        brand: 'LuxeGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', isPrimary: true }]
    },
    {
        name: 'Rose Body Oil',
        slug: 'rose-body-oil',
        description: 'Lightweight body oil infused with rose extract. Nourishes and softens skin.',
        price: 34.99,
        stock: 100,
        category: 'Bath & Body',
        brand: 'LuxeGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', isPrimary: true }]
    },
    {
        name: 'Exfoliating Body Scrub',
        slug: 'exfoliating-body-scrub',
        description: 'Sea salt and sugar scrub that gently exfoliates. Reveals smooth, radiant skin.',
        price: 24.99,
        stock: 140,
        category: 'Bath & Body',
        brand: 'AquaBloom',
        images: [{ url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', isPrimary: true }]
    },
    {
        name: 'Lavender Hand Cream',
        slug: 'lavender-hand-cream',
        description: 'Soothing hand cream with lavender essential oil. Hydrates and relaxes.',
        price: 16.99,
        stock: 200,
        category: 'Bath & Body',
        brand: 'AquaBloom',
        images: [{ url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', isPrimary: true }]
    }
];

// Seed function
const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Category.deleteMany({});
        await Brand.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        // Insert Categories
        const categories = await Category.insertMany(beautyCategories);
        console.log(`Inserted ${categories.length} categories`);

        // Insert Brands
        const brands = await Brand.insertMany(beautyBrands);
        console.log(`Inserted ${brands.length} brands`);

        // Insert Products
        const products = await Product.insertMany(beautyProducts);
        console.log(`Inserted ${products.length} beauty products`);

        console.log('\n=== Beauty Products Seed Complete ===');
        console.log('Categories:', beautyCategories.map(c => c.name).join(', '));
        console.log('Brands:', beautyBrands.map(b => b.name).join(', '));
        console.log(`Total Products: ${beautyProducts.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

// Run seed
seedDatabase();
