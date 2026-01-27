import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/db.js';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                brand: true,
                images: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(products);
    } catch (err) {
        next(err);
    }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const product = await prisma.product.findUnique({
            where: { slug: slug as string },
            include: {
                category: true,
                brand: true,
                images: true,
                variants: true,
            },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        next(err);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, slug, description, price, stock, brandId, categoryId, images } = req.body;
        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                brandId,
                categoryId,
                images: {
                    create: images.map((url: string) => ({ url, isPrimary: true })),
                },
            },
            include: { images: true, brand: true, category: true },
        });
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, slug, description, price, stock, brandId, categoryId, images } = req.body;

        if (images) {
            await prisma.productImage.deleteMany({ where: { productId: id as string } });
        }

        const product = await prisma.product.update({
            where: { id: id as string },
            data: {
                name,
                slug,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                brandId,
                categoryId,
                images: images ? {
                    create: images.map((url: string) => ({ url, isPrimary: true })),
                } : undefined,
            },
            include: { images: true, brand: true, category: true },
        });
        res.json(product);
    } catch (err) {
        next(err);
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.productImage.deleteMany({ where: { productId: id as string } });
        await prisma.product.delete({ where: { id: id as string } });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        next(err);
    }
};
