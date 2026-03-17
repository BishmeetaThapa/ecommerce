require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Brand Schema
const brandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Brand = mongoose.model('Brand', brandSchema);

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    category: { type: String, required: true },
    brand: { type: String, default: '' },
    images: [{ url: String, isPrimary: { type: Boolean, default: false } }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('Connected to MongoDB');

        // Brands to create
        const brands = [
            { name: 'Derma Co', slug: 'derma-co', description: 'Science-backed skincare for glowing skin', logo: 'https://cdn.shopify.com/s/files/1/0529/7891/8407/files/derma-co-logo.png' },
            { name: 'Centella', slug: 'centella', description: 'Korean skincare with centella asiatica', logo: '' },
            { name: 'CeraVe', slug: 'cerave', description: 'Dermatologist-recommended skincare', logo: '' },
            { name: 'Cetaphil', slug: 'cetaphil', description: 'Gentle skincare for sensitive skin', logo: '' },
            { name: 'Pilgrim', slug: 'pilgrim', description: 'K-Beauty inspired skincare', logo: '' },
            { name: 'Some By Mi', slug: 'some-by-mi', description: 'Korean beauty brand', logo: '' },
            { name: 'Cosrx', slug: 'cosrx', description: 'Korean skincare excellence', logo: '' },
            { name: 'Innisfree', slug: 'innisfree', description: 'Korean natural skincare', logo: '' },
            { name: 'Laneige', slug: 'laneige', description: 'Korean beauty hydration', logo: '' },
            { name: 'Etude House', slug: 'etude-house', description: 'Korean makeup and skincare', logo: '' },
        ];

        // Create brands
        for (const brandData of brands) {
            const existingBrand = await Brand.findOne({ slug: brandData.slug });
            if (!existingBrand) {
                const brand = new Brand(brandData);
                await brand.save();
                console.log(`Created brand: ${brandData.name}`);
            } else {
                console.log(`Brand already exists: ${brandData.name}`);
            }
        }

        // Products to create
        const products = [
            // Derma Co Products
            { name: 'Derma Co 10% Vitamin C Face Serum', slug: 'derma-co-vitamin-c-serum', description: 'Brightening vitamin C serum for radiant skin', price: 899, stock: 50, category: 'Serum', brand: 'Derma Co', images: ['https://m.media-amazon.com/images/I/61Uv4RkfT7L._AC_UF1000,1000_QL80_.jpg'] },
            { name: 'Derma Co 1% Hyaluronic Acid Serum', slug: 'derma-co-hyaluronic-serum', description: 'Deep hydration with hyaluronic acid', price: 649, stock: 45, category: 'Serum', brand: 'Derma Co', images: ['https://m.media-amazon.com/images/I/71U6dSXu8JL._AC_UF1000,1000_QL80_.jpg'] },
            { name: 'Derma Co Salicylic Acid Face Wash', slug: 'derma-co-salicylic-face-wash', description: 'Oil control face wash with salicylic acid', price: 399, stock: 60, category: 'Cleanser', brand: 'Derma Co', images: ['https://m.media-amazon.com/images/I/61WQp6AfN2L._AC_UF1000,1000_QL80_.jpg'] },
            { name: 'Derma Co 2% Niacinamide Face Serum', slug: 'derma-co-niacinamide-serum', description: 'Pore minimizing and skin brightening', price: 749, stock: 40, category: 'Serum', brand: 'Derma Co', images: ['https://m.media-amazon.com/images/I/61WQp6AfN2L._AC_UF1000,1000_QL80_.jpg'] },

            // Centella Products
            { name: 'Centella Asiatica Extract', slug: 'centella-asiatica-extract', description: 'Soothing centella asiatica for sensitive skin', price: 599, stock: 35, category: 'Serum', brand: 'Centella', images: ['https://www.skinhouse.com.au/cdn/shop/files/centella-asiatica-extract-1.jpg'] },
            { name: 'Centella Soothing Cream', slug: 'centella-soothing-cream', description: 'Calming moisturizer for irritated skin', price: 799, stock: 30, category: 'Moisturizer', brand: 'Centella', images: ['https://www.cosrx.com/cdn/shop/products/1_8f7c7df4-7d6c-4d7d-a7c0-0b5e8c3c2b8e_600x.jpg'] },

            // CeraVe Products
            { name: 'CeraVe Hydrating Cleanser', slug: 'cerave-hydrating-cleanser', description: 'Gentle face wash for normal to dry skin', price: 850, stock: 55, category: 'Cleanser', brand: 'CeraVe', images: ['https://m.media-amazon.com/images/I/61lD3J2jNML._AC_UF1000,1000_QL80_.jpg'] },
            { name: 'CeraVe Moisturizing Cream', slug: 'cerave-moisturizing-cream', description: 'Rich moisturizer with ceramides', price: 1100, stock: 40, category: 'Moisturizer', brand: 'CeraVe', images: ['https://m.media-amazon.com/images/I/61gEq4SvMhL._AC_UF1000,1000_QL80_.jpg'] },
            { name: 'CeraVe Sunscreen SPF 50', slug: 'cerave-sunscreen-spf50', description: 'Broad spectrum UVA/UVB protection', price: 1200, stock: 35, category: 'Sunscreen', brand: 'CeraVe', images: ['https://m.media-amazon.com/images/I/71lD3J2jNML._AC_UF1000,1000_QL80_.jpg'] },
            { name: 'CeraVe Retinol Serum', slug: 'cerave-retinol-serum', description: 'Anti-aging retinol serum', price: 1350, stock: 25, category: 'Serum', brand: 'CeraVe', images: ['https://m.media-amazon.com/images/I/61lD3J2jNML._AC_UF1000,1000_QL80_.jpg'] },

            // Cetaphil Products
            { name: 'Cetaphil Gentle Skin Cleanser', slug: 'cetaphil-gentle-cleanser', description: 'Mild cleanser for sensitive skin', price: 650, stock: 70, category: 'Cleanser', brand: 'Cetaphil', images: ['https://m.media-amazon.com/images/I/61WQp6AfN2L._AC_UF1000,1000_QL80_.jpg'] },
            { name: 'Cetaphil Moisturizing Cream', slug: 'cetaphil-moisturizing-cream', description: 'Long-lasting hydration for dry skin', price: 950, stock: 45, category: 'Moisturizer', brand: 'Cetaphil', images: ['https://m.media-amazon.com/images/I/71U6dSXu8JL._AC_UF1000,1000_QL80_.jpg'] },
            { name: 'Cetaphil Sunscreen SPF 30', slug: 'cetaphil-sunscreen-spf30', description: 'Lightweight sun protection', price: 890, stock: 50, category: 'Sunscreen', brand: 'Cetaphil', images: ['https://m.media-amazon.com/images/I/61gEq4SvMhL._AC_UF1000,1000_QL80_.jpg'] },

            // Pilgrim Products
            { name: 'Pilgrim Hyaluronic Acid Serum', slug: 'pilgrim-hyaluronic-serum', description: 'Korean formula hydration serum', price: 549, stock: 55, category: 'Serum', brand: 'Pilgrim', images: ['https://m.media-amazon.com/images/I/61Uv4RkfT7L._AC_UF1000,1000_QL80_.jpg'] },
            { name: 'Pilgrim Vitamin C Face Wash', slug: 'pilgrim-vitamin-c-face-wash', description: 'Brightening cleanser with vitamin C', price: 349, stock: 60, category: 'Cleanser', brand: 'Pilgrim', images: ['https://m.media-amazon.com/images/I/71lD3J2jNML._AC_UF1000,1000_QL80_.jpg'] },
            { name: 'Pilgrim Snail Mucin Essence', slug: 'pilgrim-snail-mucin-essence', description: 'Korean snail mucin for glowing skin', price: 699, stock: 40, category: 'Serum', brand: 'Pilgrim', images: ['https://m.media-amazon.com/images/I/61WQp6AfN2L._AC_UF1000,1000_QL80_.jpg'] },

            // Some By Mi Products
            { name: 'Some By Mi Yuja Niacinamide Serum', slug: 'some-by-mi-yuja-serum', description: 'Brightening vitamin C and niacinamide serum', price: 890, stock: 35, category: 'Serum', brand: 'Some By Mi', images: ['https://www.stylekorean.com/cdn/shop/products/SOMEBYMI_Yuja_Niacinamide_Brightening_Serum_50ml_1.jpg'] },
            { name: 'Some By Mi Tea Tree Calming Serum', slug: 'some-by-mi-tea-tree-serum', description: 'Soothing serum for acne-prone skin', price: 750, stock: 30, category: 'Serum', brand: 'Some By Mi', images: ['https://www.stylekorean.com/cdn/shop/files/61ed8f82c9528_image_1.jpg'] },
            { name: 'Some By Mi Snail Truecica Cream', slug: 'some-by-mi-snai-truecica-cream', description: 'Repairing cream with snail mucin', price: 1100, stock: 25, category: 'Moisturizer', brand: 'Some By Mi', images: ['https://www.stylekorean.com/cdn/shop/products/61ed8f82c9528_image_1.jpg'] },

            // Cosrx Products
            { name: 'Cosrx Advanced Snail 96 Mucin', slug: 'cosrx-snail-96-mucin', description: 'Galactomyces snail mucus essence', price: 1450, stock: 30, category: 'Serum', brand: 'Cosrx', images: ['https://www.cosrx.com/cdn/shop/products/1_8f7c7df4-7d6c-4d7d-a7c0-0b5e8c3c2b8e_600x.jpg'] },
            { name: 'Cosrx BHA Blackhead Power Liquid', slug: 'cosrx-bha-blackhead-liquid', description: 'Exfoliating toner for clear skin', price: 1250, stock: 25, category: 'Toner', brand: 'Cosrx', images: ['https://www.cosrx.com/cdn/shop/products/cosrx-bha-blackhead-power-liquid-100ml-1.jpg'] },
            { name: 'Cosrx Low pH Good Morning Gel Cleanser', slug: 'cosrx-good-morning-cleanser', description: 'Gentle morning cleanser', price: 950, stock: 40, category: 'Cleanser', brand: 'Cosrx', images: ['https://www.cosrx.com/cdn/shop/products/1_8233819e-3c40-4a7a-9e8a-4c7c9b2d1a0e_600x.jpg'] },

            // Innisfree Products
            { name: 'Innisfree Green Tea Seed Serum', slug: 'innisfree-green-tea-serum', description: 'Hydrating serum with green tea', price: 1350, stock: 30, category: 'Serum', brand: 'Innisfree', images: ['https://cdn.shopify.com/s/files/1/0529/7891/8407/products/innisfree-green-tea-seed-serum.jpg'] },
            { name: 'Innisfree Vitamin C Skin', slug: 'innisfree-vitamin-c-skin', description: 'Brightening vitamin C cream', price: 1150, stock: 25, category: 'Moisturizer', brand: 'Innisfree', images: ['https://cdn.shopify.com/s/files/1/0529/7891/8407/products/innisfree-vitamin-c-cream.jpg'] },
            { name: 'Innisfree Aloe Revital Body Lotion', slug: 'innisfree-aloe-lotion', description: 'Soothing aloe body lotion', price: 650, stock: 50, category: 'Bodycare', brand: 'Innisfree', images: ['https://cdn.shopify.com/s/files/1/0529/7891/8407/products/innisfree-aloe-lotion.jpg'] },

            // Laneige Products
            { name: 'Laneige Lip Sleeping Mask', slug: 'laneige-lip-sleeping-mask', description: 'Overnight lip treatment', price: 950, stock: 45, category: 'Lipstick', brand: 'Laneige', images: ['https://m.media-amazon.com/images/I/71U6dSXu8JL._AC_UF1000,1000_QL80_.jpg'] },
            { name: 'Laneige Water Sleeping Mask', slug: 'laneige-water-sleeping-mask', description: 'Hydrating overnight sleeping mask', price: 1650, stock: 30, category: 'Mask', brand: 'Laneige', images: ['https://m.media-amazon.com/images/I/61WQp6AfN2L._AC_UF1000,1000_QL80_.jpg'] },
            { name: 'Laneige Cream Skin Refiner', slug: 'laneige-cream-skin', description: 'Moisturizing cream toner', price: 1400, stock: 25, category: 'Toner', brand: 'Laneige', images: ['https://m.media-amazon.com/images/I/71lD3J2jNML._AC_UF1000,1000_QL80_.jpg'] },

            // Etude House Products
            { name: 'Etude House SoonJung 2x Barrier Intensive Cream', slug: 'etude-soonjung-barrier-cream', description: 'Soothing cream for sensitive skin', price: 990, stock: 35, category: 'Moisturizer', brand: 'Etude House', images: ['https://m.media-amazon.com/images/I/61Uv4RkfT7L._AC_UF1000,1000_QL80_.jpg'] },
            { name: 'Etude House Moistfull Collagen Eye Cream', slug: 'etude-collagen-eye-cream', description: 'Anti-aging eye cream with collagen', price: 1150, stock: 30, category: 'Eye Cream', brand: 'Etude House', images: ['https://m.media-amazon.com/images/I/61gEq4SvMhL._AC_UF1000,1000_QL80_.jpg'] },
            { name: 'Etude House Pink Watermelon Mask', slug: 'etude-watermelon-mask', description: 'Fresh watermelon sleeping pack', price: 750, stock: 40, category: 'Mask', brand: 'Etude House', images: ['https://m.media-amazon.com/images/I/71U6dSXu8JL._AC_UF1000,1000_QL80_.jpg'] },

            // Additional Skincare
            { name: 'Hydrating Facial Moisturizer', slug: 'hydrating-moisturizer', description: 'Lightweight daily moisturizer', price: 599, stock: 60, category: 'Moisturizer', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400'] },
            { name: 'Gentle Foam Cleanser', slug: 'gentle-foam-cleanser', description: 'pH balanced gentle cleanser', price: 450, stock: 65, category: 'Cleanser', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Vitamin E Face Cream', slug: 'vitamin-e-face-cream', description: 'Nourishing vitamin E cream', price: 699, stock: 50, category: 'Moisturizer', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'] },
        ];

        // Create products
        for (const prodData of products) {
            const existingProd = await Product.findOne({ slug: prodData.slug });
            if (!existingProd) {
                const product = new Product({
                    ...prodData,
                    images: prodData.images.map((url, index) => ({
                        url,
                        isPrimary: index === 0
                    }))
                });
                await product.save();
                console.log(`Created product: ${prodData.name}`);
            } else {
                console.log(`Product already exists: ${prodData.name}`);
            }
        }

        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
