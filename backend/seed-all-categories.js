require('dotenv').config();
const mongoose = require('mongoose');

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

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('Connected to MongoDB');

        const products = [
            // SERUM (15 products)
            { name: 'Advanced Vitamin C Brightening Serum', slug: 'advanced-vitamin-c-serum', description: 'Potent vitamin C serum for bright and radiant skin', price: 1299, stock: 40, category: 'Serum', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'] },
            { name: 'Hyaluronic Acid Hydration Serum', slug: 'hyaluronic-hydration-serum', description: 'Deep hydration serum with multiple molecular weights of HA', price: 999, stock: 45, category: 'Serum', brand: 'Derma Co', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Retinol Anti-Aging Serum', slug: 'retinol-anti-aging-serum', description: 'Advanced retinol formula for wrinkle reduction', price: 1499, stock: 30, category: 'Serum', brand: 'CeraVe', images: ['https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400'] },
            { name: 'Niacinamide Pore Minimizing Serum', slug: 'niacinamide-pore-serum', description: '10% niacinamide for pore control and skin texture', price: 899, stock: 50, category: 'Serum', brand: 'Derma Co', images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=400'] },
            { name: 'Snail Mucin Repair Serum', slug: 'snail-mucin-repair-serum', description: 'Snail secretion filtrate for skin repair', price: 1199, stock: 35, category: 'Serum', brand: 'Cosrx', images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=400'] },
            { name: 'Green Tea Antioxidant Serum', slug: 'green-tea-antioxidant-serum', description: 'ECGC rich green tea extract for antioxidant protection', price: 1099, stock: 40, category: 'Serum', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Rosehip Oil Face Serum', slug: 'rosehip-oil-serum', description: 'Pure rosehip oil for skin regeneration', price: 849, stock: 38, category: 'Serum', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'] },
            { name: 'Peptide Collagen Serum', slug: 'peptide-collagen-serum', description: 'Multi-peptide formula for firming', price: 1599, stock: 28, category: 'Serum', brand: 'Pilgrim', images: ['https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400'] },
            { name: 'Azelaic Acid Clarifying Serum', slug: 'azelaic-acid-serum', description: '15% azelaic acid for acne and pigmentation', price: 1299, stock: 32, category: 'Serum', brand: 'Some By Mi', images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=400'] },
            { name: 'Propolis Bee Venom Serum', slug: 'propolis-bee-venom-serum', description: 'Propolis extract for glowing skin', price: 1399, stock: 30, category: 'Serum', brand: 'Centella', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Fermented Rice Water Serum', slug: 'fermented-rice-serum', description: 'Yeast fermented rice water for brightening', price: 999, stock: 42, category: 'Serum', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'] },
            { name: 'Bifida Biome Complex Serum', slug: 'bifida-biome-serum', description: 'Postbiotic complex for skin barrier', price: 1699, stock: 25, category: 'Serum', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400'] },
            { name: 'Vitamin F Face Serum', slug: 'vitamin-f-face-serum', description: 'Essential fatty acids for skin health', price: 799, stock: 48, category: 'Serum', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=400'] },
            { name: 'AHA BHA Rice Toner', slug: 'aha-bha-rice-toner', description: 'Exfoliating toner with rice water', price: 899, stock: 45, category: 'Serum', brand: 'Cosrx', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Cica Calming Serum', slug: 'cica-calming-serum', description: 'Centella asiatica for sensitive skin', price: 949, stock: 40, category: 'Serum', brand: 'Centella', images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'] },

            // MOISTURIZER (15 products)
            { name: 'Daily Hydrating Moisturizer', slug: 'daily-hydrating-moisturizer', description: 'Lightweight daily moisturizer for all skin types', price: 699, stock: 55, category: 'Moisturizer', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400'] },
            { name: 'Ultra Repair Cream', slug: 'ultra-repair-cream', description: 'Rich cream for very dry skin', price: 1299, stock: 40, category: 'Moisturizer', brand: 'CeraVe', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Water Cream Oil-Free', slug: 'water-cream-oil-free', description: 'Oil-free gel cream for oily skin', price: 1199, stock: 45, category: 'Moisturizer', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400'] },
            { name: 'Deep Moisture Barrier Cream', slug: 'deep-moisture-barrier-cream', description: 'Ceramide enriched barrier repair cream', price: 1099, stock: 38, category: 'Moisturizer', brand: 'Cetaphil', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Green Tea Fresh Cream', slug: 'green-tea-fresh-cream', description: 'Lightweight green tea moisturizer', price: 999, stock: 42, category: 'Moisturizer', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400'] },
            { name: 'Aloe Soothing Gel Cream', slug: 'aloe-soothing-gel-cream', description: 'Cooling aloe vera gel cream', price: 749, stock: 50, category: 'Moisturizer', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Peptide Firming Cream', slug: 'peptide-firming-cream', description: 'Anti-aging peptide cream for firming', price: 1599, stock: 30, category: 'Moisturizer', brand: 'Derma Co', images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400'] },
            { name: 'Honey Moisture Cream', slug: 'honey-moisture-cream', description: 'Royal honey enriched moisturizing cream', price: 1149, stock: 35, category: 'Moisturizer', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Snail Repair Cream', slug: 'snail-repair-cream', description: 'Snail mucin cream for damaged skin', price: 1299, stock: 32, category: 'Moisturizer', brand: 'Some By Mi', images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400'] },
            { name: 'Hyaluronic Cream', slug: 'hyaluronic-cream', description: '3 types of hyaluronic acid cream', price: 1099, stock: 40, category: 'Moisturizer', brand: 'Pilgrim', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Sensitive Skin Cream', slug: 'sensitive-skin-cream', description: 'Fragrance-free cream for sensitive skin', price: 899, stock: 48, category: 'Moisturizer', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400'] },
            { name: 'Matte Finish Cream', slug: 'matte-finish-cream', description: 'Oil-control matte moisturizer', price: 849, stock: 45, category: 'Moisturizer', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Night Recovery Cream', slug: 'night-recovery-cream', description: 'Overnight nourishing recovery cream', price: 1399, stock: 35, category: 'Moisturizer', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400'] },
            { name: 'Probiotic Moisturizer', slug: 'probiotic-moisturizer', description: 'Probiotic skin barrier cream', price: 1249, stock: 38, category: 'Moisturizer', brand: 'CeraVe', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Vita Skin Tone Up Cream', slug: 'vita-skin-tone-up-cream', description: 'Vitamin-infused tone up cream', price: 999, stock: 42, category: 'Moisturizer', brand: 'Some By Mi', images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400'] },

            // CLEANSER (15 products)
            { name: 'Gentle Foam Cleanser', slug: 'gentle-foam-cleanser', description: 'pH balanced gentle foam cleanser', price: 499, stock: 60, category: 'Cleanser', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Hydrating Cream Cleanser', slug: 'hydrating-cream-cleanser', description: 'Creamy hydrating face wash', price: 699, stock: 55, category: 'Cleanser', brand: 'CeraVe', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Oil Cleanser', slug: 'oil-cleanser', description: 'Deep cleansing oil for makeup removal', price: 599, stock: 50, category: 'Cleanser', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Salicylic Acid Cleanser', slug: 'salicylic-acid-cleanser', description: 'BHA cleanser for acne-prone skin', price: 549, stock: 48, category: 'Cleanser', brand: 'Derma Co', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Enzyme Powder Cleanser', slug: 'enzyme-powder-cleanser', description: 'Papain enzyme exfoliating cleanser', price: 899, stock: 40, category: 'Cleanser', brand: 'Cosrx', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Micellar Water', slug: 'micellar-water', description: 'No-rinse micellar cleansing water', price: 449, stock: 65, category: 'Cleanser', brand: 'Cetaphil', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Vitamin C Brightening Cleanser', slug: 'vitamin-c-cleanser', description: 'Cleanser with vitamin C for brightening', price: 549, stock: 52, category: 'Cleanser', brand: 'Pilgrim', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Green Tea Foam Cleanser', slug: 'green-tea-foam-cleanser', description: 'Antioxidant green tea cleanser', price: 499, stock: 55, category: 'Cleanser', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Clay Pore Cleansing', slug: 'clay-pore-cleansing', description: 'Deep cleansing clay mask cleanser', price: 649, stock: 45, category: 'Cleanser', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Snail Cleanser', slug: 'snail-cleanser', description: 'Snail mucin infused cleanser', price: 599, stock: 42, category: 'Cleanser', brand: 'Some By Mi', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Honey Cleanser', slug: 'honey-cleanser', description: 'Propolis and honey cleansing wash', price: 549, stock: 48, category: 'Cleanser', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Low pH Gel Cleanser', slug: 'low-ph-gel-cleanser', description: '5.5 pH mild gel cleanser', price: 649, stock: 50, category: 'Cleanser', brand: 'Cosrx', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Centella Cleansing Foam', slug: 'centella-cleansing-foam', description: 'Soothing centella foam cleanser', price: 529, stock: 46, category: 'Cleanser', brand: 'Centella', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Jelly Cleanser', slug: 'jelly-cleanser', description: 'Soft jelly texture cleanser', price: 479, stock: 52, category: 'Cleanser', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },
            { name: 'Charcoal Detox Cleanser', slug: 'charcoal-detox-cleanser', description: 'Activated charcoal deep cleanser', price: 499, stock: 48, category: 'Cleanser', brand: 'Pilgrim', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400'] },

            // SUNSCREEN (15 products)
            { name: 'SPF 50+ Sunscreen', slug: 'spf-50-sunscreen', description: 'Broad spectrum UVA/UVB SPF 50+ protection', price: 799, stock: 55, category: 'Sunscreen', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Invisible Fluid Sunscreen', slug: 'invisible-fluid-sunscreen', description: 'Weightless invisible SPF 50', price: 1299, stock: 45, category: 'Sunscreen', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Watery Essence Sunscreen', slug: 'watery-essence-sunscreen', description: 'Korean watery essence sun gel SPF 50', price: 999, stock: 50, category: 'Sunscreen', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Mineral Sunscreen SPF 30', slug: 'mineral-sunscreen-spf30', description: 'Zinc oxide mineral sunscreen', price: 899, stock: 48, category: 'Sunscreen', brand: 'Cetaphil', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Cica Sun Cream', slug: 'cica-sun-cream', description: 'Soothing centella SPF 50+ sun cream', price: 949, stock: 42, category: 'Sunscreen', brand: 'Some By Mi', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'UV Aqua Rich Watery Essence', slug: 'uv-aqua-rich-watery', description: 'Biore UV Aqua Rich SPF 50', price: 749, stock: 55, category: 'Sunscreen', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Matte Sunscreen SPF 50', slug: 'matte-sunscreen-spf50', description: 'Oil-control matte finish sunscreen', price: 849, stock: 46, category: 'Sunscreen', brand: 'Derma Co', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Dewy Glow Sunscreen', slug: 'dewy-glow-sunscreen', description: 'Dewy finish sunscreen for glow', price: 999, stock: 40, category: 'Sunscreen', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Kids Mineral Sunscreen', slug: 'kids-mineral-sunscreen', description: 'Gentle SPF 50 for kids', price: 699, stock: 38, category: 'Sunscreen', brand: 'CeraVe', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Tone Up Sun Cream', slug: 'tone-up-sun-cream', description: 'Purple tone up SPF 50+', price: 899, stock: 44, category: 'Sunscreen', brand: 'Pilgrim', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Lip Balm SPF 30', slug: 'lip-balm-spf30', description: 'UV protecting lip balm', price: 299, stock: 60, category: 'Sunscreen', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Stick Sunscreen SPF 50', slug: 'stick-sunscreen-spf50', description: 'Convenient stick format sunscreen', price: 599, stock: 50, category: 'Sunscreen', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Dual Barrier Sunscreen', slug: 'dual-barrier-sunscreen', description: 'SPF 50+ with skin barrier care', price: 1099, stock: 36, category: 'Sunscreen', brand: 'Centella', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Face Mist with SPF', slug: 'face-mist-with-spf', description: 'Refreshing mist SPF 30', price: 699, stock: 45, category: 'Sunscreen', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },
            { name: 'Pro Sunscreen SPF 50', slug: 'pro-sunscreen-spf50', description: 'Professional grade SPF 50', price: 1199, stock: 32, category: 'Sunscreen', brand: 'Cosrx', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'] },

            // LIPSTICK (10 products)
            { name: 'Matte Lipstick', slug: 'matte-lipstick', description: 'Long-lasting matte finish lipstick', price: 599, stock: 60, category: 'Lipstick', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'] },
            { name: 'Lip Tint Stain', slug: 'lip-tint-stain', description: 'Long-wear lip tint stain', price: 549, stock: 55, category: 'Lipstick', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'] },
            { name: 'Glossy Lip Balm', slug: 'glossy-lip-balm', description: 'Moisturizing glossy lip color', price: 399, stock: 65, category: 'Lipstick', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'] },
            { name: 'Velvet Lip Cream', slug: 'velvet-lip-cream', description: 'Soft velvet texture lip cream', price: 649, stock: 50, category: 'Lipstick', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'] },
            { name: 'Water Tint Lip', slug: 'water-tint-lip', description: 'Lightweight water-based lip tint', price: 499, stock: 52, category: 'Lipstick', brand: 'Some By Mi', images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'] },
            { name: 'Creamy Lipstick', slug: 'creamy-lipstick', description: 'Hydrating creamy lipstick', price: 549, stock: 48, category: 'Lipstick', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'] },
            { name: 'Lip Oil', slug: 'lip-oil', description: 'Nourishing lip oil with color', price: 449, stock: 58, category: 'Lipstick', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'] },
            { name: 'Lip Sleeping Mask', slug: 'lip-sleeping-mask', description: 'Overnight lip treatment mask', price: 699, stock: 45, category: 'Lipstick', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'] },
            { name: 'Cushion Lipstick', slug: 'cushion-lipstick', description: 'Cushion tip lipstick', price: 599, stock: 50, category: 'Lipstick', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'] },
            { name: 'Lip Liner', slug: 'lip-liner', description: 'Precise lip liner pencil', price: 349, stock: 55, category: 'Lipstick', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'] },

            // FOUNDATION (10 products)
            { name: 'Cushion Foundation', slug: 'cushion-foundation', description: 'K-beauty cushion foundation SPF 50', price: 1499, stock: 40, category: 'Foundation', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400'] },
            { name: 'Matte Foundation', slug: 'matte-foundation', description: 'Full coverage matte foundation', price: 1299, stock: 38, category: 'Foundation', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400'] },
            { name: 'Dewy Foundation', slug: 'dewy-foundation', description: 'Hydrating dewy finish foundation', price: 1199, stock: 42, category: 'Foundation', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400'] },
            { name: 'BB Cream', slug: 'bb-cream', description: 'All-in-one BB cream with SPF', price: 899, stock: 50, category: 'Foundation', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400'] },
            { name: 'CC Cream', slug: 'cc-cream', description: 'Color correcting CC cream', price: 999, stock: 45, category: 'Foundation', brand: 'Some By Mi', images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400'] },
            { name: 'Satin Foundation', slug: 'satin-foundation', description: 'Medium coverage satin finish', price: 1399, stock: 35, category: 'Foundation', brand: 'Cosrx', images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400'] },
            { name: 'Stick Foundation', slug: 'stick-foundation', description: 'Convenient stick foundation', price: 1099, stock: 40, category: 'Foundation', brand: 'Derma Co', images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400'] },
            { name: 'Tone Up Cream', slug: 'tone-up-cream-foundation', description: 'Brightening tone up cream', price: 799, stock: 48, category: 'Foundation', brand: 'Pilgrim', images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400'] },
            { name: 'Serum Foundation', slug: 'serum-foundation', description: 'Serum-infused lightweight foundation', price: 1599, stock: 32, category: 'Foundation', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400'] },
            { name: 'Powder Foundation', slug: 'powder-foundation', description: 'Oil-control powder foundation', price: 1149, stock: 38, category: 'Foundation', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400'] },

            // HAIRCARE (10 products)
            { name: 'Shampoo', slug: 'shampoo', description: 'Gentle daily shampoo', price: 499, stock: 60, category: 'Haircare', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1585232569525-f087bd9dae8e?w=400'] },
            { name: 'Conditioner', slug: 'conditioner', description: 'Deep conditioning treatment', price: 549, stock: 55, category: 'Haircare', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1585232569525-f087bd9dae8e?w=400'] },
            { name: 'Hair Mask', slug: 'hair-mask', description: 'Intensive hair treatment mask', price: 799, stock: 45, category: 'Haircare', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1585232569525-f087bd9dae8e?w=400'] },
            { name: 'Hair Serum', slug: 'hair-serum', description: 'Hair smoothing serum', price: 649, stock: 50, category: 'Haircare', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1585232569525-f087bd9dae8e?w=400'] },
            { name: 'Scalp Treatment', slug: 'scalp-treatment', description: 'Scalp care treatment', price: 699, stock: 42, category: 'Haircare', brand: 'Some By Mi', images: ['https://images.unsplash.com/photo-1585232569525-f087bd9dae8e?w=400'] },
            { name: 'Hair Oil', slug: 'hair-oil', description: 'Argan hair oil', price: 599, stock: 48, category: 'Haircare', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1585232569525-f087bd9dae8e?w=400'] },
            { name: 'Leave-In Conditioner', slug: 'leave-in-conditioner', description: 'Spray leave-in conditioner', price: 549, stock: 52, category: 'Haircare', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1585232569525-f087bd9dae8e?w=400'] },
            { name: 'Hair Spray', slug: 'hair-spray', description: 'Flexible hold hair spray', price: 449, stock: 55, category: 'Haircare', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1585232569525-f087bd9dae8e?w=400'] },
            { name: 'Anti-Hair Fall Treatment', slug: 'anti-hair-fall-treatment', description: 'Hair fall control treatment', price: 999, stock: 38, category: 'Haircare', brand: 'Derma Co', images: ['https://images.unsplash.com/photo-1585232569525-f087bd9dae8e?w=400'] },
            { name: 'Scalp Shampoo', slug: 'scalp-shampoo', description: 'Exfoliating scalp shampoo', price: 549, stock: 46, category: 'Haircare', brand: 'Cosrx', images: ['https://images.unsplash.com/photo-1585232569525-f087bd9dae8e?w=400'] },

            // BODY CARE (10 products)
            { name: 'Body Lotion', slug: 'body-lotion', description: 'Hydrating body lotion', price: 599, stock: 55, category: 'Bodycare', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Body Butter', slug: 'body-butter', description: 'Rich shea body butter', price: 799, stock: 45, category: 'Bodycare', brand: 'CeraVe', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Body Oil', slug: 'body-oil', description: 'Moisturizing body oil', price: 699, stock: 48, category: 'Bodycare', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Hand Cream', slug: 'hand-cream', description: 'Nourishing hand cream', price: 349, stock: 65, category: 'Bodycare', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Foot Cream', slug: 'foot-cream', description: 'Intensive foot care cream', price: 449, stock: 52, category: 'Bodycare', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Body Scrub', slug: 'body-scrub', description: 'Exfoliating body scrub', price: 549, stock: 50, category: 'Bodycare', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Shower Gel', slug: 'shower-gel', description: 'Refreshing shower gel', price: 399, stock: 60, category: 'Bodycare', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Body Mist', slug: 'body-mist', description: 'Long-lasting body mist', price: 449, stock: 55, category: 'Bodycare', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Deodorant', slug: 'deodorant', description: '24hr protection deodorant', price: 399, stock: 58, category: 'Bodycare', brand: 'Cetaphil', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Body Wash', slug: 'body-wash', description: 'Gentle body wash', price: 449, stock: 52, category: 'Bodycare', brand: 'CeraVe', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },

            // EYE CREAM (8 products)
            { name: 'Eye Cream', slug: 'eye-cream', description: 'Anti-aging eye cream', price: 1299, stock: 45, category: 'Eye Cream', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=400'] },
            { name: 'Eye Serum', slug: 'eye-serum', description: 'Lightweight eye serum', price: 1099, stock: 42, category: 'Eye Cream', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=400'] },
            { name: 'Caffeine Eye Cream', slug: 'caffeine-eye-cream', description: 'Depuffing caffeine eye cream', price: 999, stock: 48, category: 'Eye Cream', brand: 'Some By Mi', images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=400'] },
            { name: 'Peptide Eye Cream', slug: 'peptide-eye-cream', description: 'Firming peptide eye cream', price: 1499, stock: 35, category: 'Eye Cream', brand: 'Derma Co', images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=400'] },
            { name: 'Hydrating Eye Cream', slug: 'hydrating-eye-cream', description: 'Moisturizing eye cream', price: 899, stock: 50, category: 'Eye Cream', brand: 'CeraVe', images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=400'] },
            { name: 'Brightening Eye Cream', slug: 'brightening-eye-cream', description: 'Dark circle eye cream', price: 1199, stock: 40, category: 'Eye Cream', brand: 'Pilgrim', images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=400'] },
            { name: 'Collagen Eye Cream', slug: 'collagen-eye-cream', description: 'Anti-wrinkle collagen eye cream', price: 1399, stock: 36, category: 'Eye Cream', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=400'] },
            { name: 'Gel Eye Cream', slug: 'gel-eye-cream', description: 'Cooling gel eye cream', price: 849, stock: 46, category: 'Eye Cream', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=400'] },

            // TONER (8 products)
            { name: 'Hydrating Toner', slug: 'hydrating-toner', description: 'Deep hydration toner', price: 699, stock: 50, category: 'Toner', brand: 'CeraVe', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Exfoliating Toner', slug: 'exfoliating-toner', description: 'AHA BHA exfoliating toner', price: 849, stock: 45, category: 'Toner', brand: 'Cosrx', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Soothing Toner', slug: 'soothing-toner', description: 'Centella soothing toner', price: 649, stock: 48, category: 'Toner', brand: 'Some By Mi', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Pore Toner', slug: 'pore-toner', description: 'Pore minimizing toner', price: 599, stock: 52, category: 'Toner', brand: 'Derma Co', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Rice Toner', slug: 'rice-toner', description: 'Brightening rice water toner', price: 699, stock: 46, category: 'Toner', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Milk Toner', slug: 'milk-toner', description: 'Milky hydrating toner', price: 749, stock: 44, category: 'Toner', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Green Tea Toner', slug: 'green-tea-toner', description: 'Green tea fresh toner', price: 549, stock: 50, category: 'Toner', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },
            { name: 'Balancing Toner', slug: 'balancing-toner', description: 'pH balancing toner', price: 499, stock: 55, category: 'Toner', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'] },

            // MASK (8 products)
            { name: 'Sheet Mask', slug: 'sheet-mask', description: 'Hydrating sheet mask', price: 99, stock: 100, category: 'Mask', brand: 'EverGlow', images: ['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400'] },
            { name: 'Sleeping Mask', slug: 'sleeping-mask', description: 'Overnight sleeping mask', price: 899, stock: 45, category: 'Mask', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400'] },
            { name: 'Clay Mask', slug: 'clay-mask', description: 'Purifying clay mask', price: 649, stock: 48, category: 'Mask', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400'] },
            { name: 'Cream Mask', slug: 'cream-mask', description: 'Nourishing cream mask', price: 799, stock: 42, category: 'Mask', brand: 'CeraVe', images: ['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400'] },
            { name: 'Gel Mask', slug: 'gel-mask', description: 'Cooling gel mask', price: 549, stock: 50, category: 'Mask', brand: 'Etude House', images: ['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400'] },
            { name: 'Lip Mask', slug: 'lip-mask', description: 'Lip sleeping pack', price: 599, stock: 55, category: 'Mask', brand: 'Laneige', images: ['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400'] },
            { name: 'Eye Mask', slug: 'eye-mask', description: 'Under eye patches', price: 449, stock: 52, category: 'Mask', brand: 'Some By Mi', images: ['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400'] },
            { name: 'Wash Off Mask', slug: 'wash-off-mask', description: 'Gentle wash off mask', price: 599, stock: 46, category: 'Mask', brand: 'Innisfree', images: ['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400'] },
        ];

        // Create products
        let created = 0;
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
                console.log(`Created: ${prodData.category} - ${prodData.name}`);
                created++;
            } else {
                console.log(`Exists: ${prodData.name}`);
            }
        }

        console.log(`\n✅ Seed completed! Created ${created} new products.`);

        // Print summary
        const categories = [...new Set(products.map(p => p.category))];
        console.log('\n📊 Products by category:');
        for (const cat of categories) {
            const count = products.filter(p => p.category === cat).length;
            console.log(`   ${cat}: ${count} products`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedProducts();
