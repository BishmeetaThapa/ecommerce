import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/db.js';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                _count: { select: { orders: true } }
            }
        });
        res.json(users);
    } catch (err) {
        next(err);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: id as string },
            include: {
                orders: true,
                addresses: true
            }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await prisma.user.update({
            where: { id: id as string },
            data: { role }
        });
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: id as string } });
        res.json({ message: 'User deleted' });
    } catch (err) {
        next(err);
    }
};
