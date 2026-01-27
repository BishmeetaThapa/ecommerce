import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/db.js';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, items, totalAmount, shippingAddress } = req.body;

        const order = await prisma.order.create({
            data: {
                userId,
                totalAmount: parseFloat(totalAmount),
                shippingAddress,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: parseInt(item.quantity),
                        price: parseFloat(item.price)
                    }))
                }
            },
            include: { items: true }
        });

        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id: id as string },
            include: {
                user: true,
                items: { include: { product: true } }
            }
        });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        next(err);
    }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await prisma.order.update({
            where: { id: id as string },
            data: { status }
        });
        res.json(order);
    } catch (err) {
        next(err);
    }
};
