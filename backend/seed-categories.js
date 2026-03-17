require('dotenv').config();
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('Connected to MongoDB');

        // Sample categories to create
        const categories = [
            { name: 'Combo', slug: 'combo', description: 'Bundle deals and combos', image: 'https://cdn.vectorstock.com/i/500p/75/06/combo-offers-banner-vector-60167506.jpg' },
            { name: 'Korean Beauty', slug: 'korean-beauty', description: 'K-Beauty products', image: 'https://cdn-cjhgk.nitrocdn.com/CXxGixRVyChwAxySbAyltuCiQXRKaWDN/assets/images/optimized/rev-9dad235/www.newbeauty.com/wp-content/uploads/2025/01/amazon-k-beauty.jpg' },
            { name: 'Skincare', slug: 'skincare', description: 'Skincare products', image: 'https://media.gq.com/photos/67295862476e3ee9ef071cdb/16:9/w_1280,c_limit/lededryskin.png' },
            { name: 'Sunscreen', slug: 'sunscreen', description: 'Sunscreen and SPF products', image: 'https://www.healme.com.np/storage/Product/PR-1688743339-1521835.webp' },
            { name: 'Haircare', slug: 'haircare', description: 'Hair care products', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9VB_pEdm4xpqP1TYe_kvB4NbHnQhEL2hnrg&s' },
            { name: 'Makeup', slug: 'makeup', description: 'Makeup products', image: 'https://glam21.in/cdn/shop/articles/12f51da6cd36ef54da0bf039797a3a7d.jpg?v=1676290647' },
            { name: 'Lipstick', slug: 'lipstick', description: 'Lip colors and lipsticks', image: 'https://akns-images.eonline.com/eol_images/Entire_Site/2023624/rs_1024x759-230724093424-1024-E_Insider_Shop-Best_Lipsticks-gj.jpg' },
            { name: 'Foundation', slug: 'foundation', description: 'Foundation and base makeup', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrEURwEirNbQJ48Mt6mm-7gDtS_fFkaL39iQ&s' },
            { name: 'Bodycare', slug: 'bodycare', description: 'Body care products', image: 'https://img.freepik.com/free-photo/top-view-bath-concept-accessories_23-2148419370.jpg' },
            { name: 'Accessories', slug: 'accessories', description: 'Beauty accessories', image: 'https://img.freepik.com/free-photo/luxurious-shiny-golden-chain_23-2149635280.jpg' },
            { name: 'Babycare', slug: 'babycare', description: 'Baby care products', image: 'https://play-lh.googleusercontent.com/xFmpqGFhdU83jp9n8OxtE4GlXrIkndldG6TBGY_CyKYcgs_fB-aQASB2YA3EEdyiNQ' },
            { name: 'Bogo', slug: 'bogo', description: 'Buy one get one offers', image: 'https://www.shutterstock.com/image-vector/bogo-sale-buy-one-get-600nw-1737964088.jpg' },
            { name: 'Serum', slug: 'serum', description: 'Face serums', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400' },
            { name: 'Moisturizer', slug: 'moisturizer', description: 'Moisturizers and creams', image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400' },
            { name: 'Cleanser', slug: 'cleanser', description: 'Face cleansers', image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400' },
        ];

        // Create categories
        for (const catData of categories) {
            const existingCat = await Category.findOne({ slug: catData.slug });
            if (!existingCat) {
                const category = new Category(catData);
                await category.save();
                console.log(`Created category: ${catData.name}`);
            } else {
                console.log(`Category already exists: ${catData.name}`);
            }
        }

        console.log('Category seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
