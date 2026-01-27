import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/db.js';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { products: true } } }
        });
        res.json(categories);
    } catch (err) {
        next(err);
    }
};

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const category = await prisma.category.findUnique({
            where: { slug: slug as string },
            include: { products: { include: { images: true, brand: true } } }
        });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (err) {
        next(err);
    }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, slug } = req.body;
        const category = await prisma.category.create({
            data: { name, slug }
        });
        res.status(201).json(category);
    } catch (err) {
        next(err);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;
        const category = await prisma.category.update({
            where: { id: id as string },
            data: { name, slug }
        });
        res.json(category);
    } catch (err) {
        next(err);
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({ where: { id: id as string } });
        res.json({ message: 'Category deleted' });
    } catch (err) {
        next(err);
    }
};
