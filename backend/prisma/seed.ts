import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with 20+ products...');

    // 1. Create Categories
    const categoriesData = [
        { name: 'Skincare', slug: 'skincare' },
        { name: 'Makeup', slug: 'makeup' },
        { name: 'Haircare', slug: 'haircare' },
        { name: 'Fragrance', slug: 'fragrance' },
        { name: 'Body Care', slug: 'body-care' },
    ];

    const categories: any = {};
    for (const cat of categoriesData) {
        categories[cat.slug] = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }

    // 2. Create Brands
    const brandsData = [
        { name: 'EverGlow' },
        { name: 'Glossier' },
        { name: 'Fenty Beauty' },
        { name: 'The Ordinary' },
        { name: 'Laneige' },
        { name: 'Drunk Elephant' },
    ];

    const brands: any = {};
    for (const brand of brandsData) {
        brands[brand.name] = await prisma.brand.upsert({
            where: { name: brand.name },
            update: {},
            create: brand,
        });
    }

    // 3. Create Products (20+)
    const products = [
        // Skincare
        {
            name: 'Hydrating Serum',
            slug: 'hydrating-serum',
            description: 'A deeply hydrating serum with hyaluronic acid for a radiant glow.',
            price: 1299.00,
            stock: 50,
            brandId: brands['EverGlow'].id,
            categoryId: categories['skincare'].id,
            images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Vitamin C Glow Toner',
            slug: 'vitamin-c-toner',
            description: 'Brighten and even out your skin tone with this potent Vitamin C toner.',
            price: 950.00,
            stock: 45,
            brandId: brands['EverGlow'].id,
            categoryId: categories['skincare'].id,
            images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Milky Jelly Cleanser',
            slug: 'milky-jelly-cleanser',
            description: 'Everything a cleanser should be. pH-balanced, non-irritating, and effective.',
            price: 1800.00,
            stock: 30,
            brandId: brands['Glossier'].id,
            categoryId: categories['skincare'].id,
            images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Hyaluronic Acid 2% + B5',
            slug: 'the-ordinary-ha',
            description: 'A hydration support formula with ultra-pure, vegan hyaluronic acid.',
            price: 750.00,
            stock: 120,
            brandId: brands['The Ordinary'].id,
            categoryId: categories['skincare'].id,
            images: ['https://images.unsplash.com/photo-1620917670397-dc71bce6d2c2?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Water Sleeping Mask',
            slug: 'laneige-sleeping-mask',
            description: 'An overnight mask that gives the skin a lively, well-rested appearance the next morning.',
            price: 2400.00,
            stock: 60,
            brandId: brands['Laneige'].id,
            categoryId: categories['skincare'].id,
            images: ['https://images.unsplash.com/photo-1567721913486-6585f069b332?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Lala Retro Whipped Cream',
            slug: 'drunk-elephant-cream',
            description: 'A multifaceted rescue cream that provides replenishing barrier support.',
            price: 5200.00,
            stock: 25,
            brandId: brands['Drunk Elephant'].id,
            categoryId: categories['skincare'].id,
            images: ['https://images.unsplash.com/photo-1594125350485-3bb724e0f074?auto=format&fit=crop&q=80&w=400'],
        },

        // Makeup
        {
            name: 'Matte Lipstick - Ruby',
            slug: 'matte-lipstick-ruby',
            description: 'Long-lasting matte lipstick in shade Ruby Red for a bold finish.',
            price: 899.00,
            stock: 100,
            brandId: brands['EverGlow'].id,
            categoryId: categories['makeup'].id,
            images: ['https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Pro Filt\'r Soft Matte Foundation',
            slug: 'fenty-foundation',
            description: 'Longwear, light-as-air foundation that gives skin an instantly smooth finish.',
            price: 3800.00,
            stock: 40,
            brandId: brands['Fenty Beauty'].id,
            categoryId: categories['makeup'].id,
            images: ['https://images.unsplash.com/photo-1599733594230-6b823276abcc?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Cloud Paint Seamless Cheek Color',
            slug: 'glossier-cloud-paint',
            description: 'A user-friendly, gel-cream blush you can’t mess up.',
            price: 1950.00,
            stock: 80,
            brandId: brands['Glossier'].id,
            categoryId: categories['makeup'].id,
            images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Volume Mascara - Pitch Black',
            slug: 'everglow-mascara',
            description: 'Intense volume and length for your lashes with a smudge-proof formula.',
            price: 1100.00,
            stock: 75,
            brandId: brands['EverGlow'].id,
            categoryId: categories['makeup'].id,
            images: ['https://images.unsplash.com/photo-1591360236630-3d84f8db08ca?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Glowy Makeup Serum',
            slug: 'laneige-glowy-serum',
            description: 'A makeup-priming serum that hydrates and adds a healthy glow.',
            price: 2100.00,
            stock: 35,
            brandId: brands['Laneige'].id,
            categoryId: categories['makeup'].id,
            images: ['https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=400'],
        },

        // Haircare
        {
            name: 'Argan Oil Hair Mask',
            slug: 'argan-hair-mask',
            description: 'Repair damaged hair and restore shine with our organic argan oil mask.',
            price: 1599.00,
            stock: 20,
            brandId: brands['EverGlow'].id,
            categoryId: categories['haircare'].id,
            images: ['https://images.unsplash.com/photo-1527799822340-304cf64783bb?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Custom Hair Oil',
            slug: 'personalized-hair-oil',
            description: 'A weightless oil for shine, smoothness, and frizz control.',
            price: 2800.00,
            stock: 15,
            brandId: brands['EverGlow'].id,
            categoryId: categories['haircare'].id,
            images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=400'],
        },

        // Fragrance
        {
            name: 'Midnight Rose Eau de Parfum',
            slug: 'everglow-fragrance-rose',
            description: 'A sophisticated floral scent with notes of Bulgarian rose and blackcurrant.',
            price: 3499.00,
            stock: 20,
            brandId: brands['EverGlow'].id,
            categoryId: categories['fragrance'].id,
            images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'You Eau de Parfum',
            slug: 'glossier-you',
            description: 'The ultimate personal fragrance. Warm, soft, and familiar.',
            price: 4800.00,
            stock: 30,
            brandId: brands['Glossier'].id,
            categoryId: categories['fragrance'].id,
            images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400'],
        },

        // Body Care
        {
            name: 'Cocoa Butter Body Lotion',
            slug: 'cocoa-body-lotion',
            description: 'Intense moisture for dry skin with the sweet aroma of cocoa.',
            price: 1150.00,
            stock: 90,
            brandId: brands['EverGlow'].id,
            categoryId: categories['body-care'].id,
            images: ['https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Sea Salt Body Scrub',
            slug: 'everglow-body-scrub',
            description: 'Exfoliate and soften your skin with natural Mediterranean sea salt.',
            price: 1350.00,
            stock: 55,
            brandId: brands['EverGlow'].id,
            categoryId: categories['body-care'].id,
            images: ['https://images.unsplash.com/photo-1608247764146-d730a9629b35?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Lip Sleeping Mask - Berry',
            slug: 'laneige-lip-mask',
            description: 'A leave-on lip mask that soothes and moisturizes for smoother, more supple lips.',
            price: 1500.00,
            stock: 150,
            brandId: brands['Laneige'].id,
            categoryId: categories['body-care'].id,
            images: ['https://images.unsplash.com/photo-1512496011951-a699aa56a64b?auto=format&fit=crop&q=80&w=400'],
        },

        // More Products to reach 20+
        {
            name: 'Sunscreen Gel SPF 50',
            slug: 'everglow-sunscreen',
            description: 'Broad-spectrum protection with a non-sticky, matte finish.',
            price: 1450.00,
            stock: 200,
            brandId: brands['EverGlow'].id,
            categoryId: categories['skincare'].id,
            images: ['https://images.unsplash.com/photo-1556228570-4192763673ab?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Liquid Eyeliner - Black',
            slug: 'everglow-eyeliner',
            description: 'Waterproof liquid eyeliner with a precision tip for the perfect wing.',
            price: 750.00,
            stock: 110,
            brandId: brands['EverGlow'].id,
            categoryId: categories['makeup'].id,
            images: ['https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Facial Oil with Rosehip',
            slug: 'everglow-rosehip-oil',
            description: '100% pure cold-pressed rosehip seed oil for organic hydration.',
            price: 1600.00,
            stock: 35,
            brandId: brands['EverGlow'].id,
            categoryId: categories['skincare'].id,
            images: ['https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400'],
        },
        {
            name: 'Conditioning Hair Mist',
            slug: 'everglow-hair-mist',
            description: 'Lightweight leave-in conditioner to detangle and protect against heat.',
            price: 1250.00,
            stock: 40,
            brandId: brands['EverGlow'].id,
            categoryId: categories['haircare'].id,
            images: ['https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=400'],
        },
    ];

    for (const p of products) {
        const { images, ...productData } = p;
        const product = await prisma.product.upsert({
            where: { slug: p.slug },
            update: productData,
            create: {
                ...productData,
                images: {
                    create: images.map(url => ({ url, isPrimary: true })),
                },
            },
        });
        console.log(`✅ Created product: ${product.name}`);
    }

    console.log('✨ Seeding finished.');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
