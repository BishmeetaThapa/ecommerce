import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/auth/auth.routes.js';
import productRoutes from './api/products/product.routes.js';
import orderRoutes from './api/orders/order.routes.js';
import userRoutes from './api/users/user.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Basic Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use(errorHandler);

export default app;
