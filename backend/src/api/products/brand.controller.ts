import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/db.js';

export const getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const brands = await prisma.brand.findMany();
        res.json(brands);
    } catch (err) {
        next(err);
    }
};
