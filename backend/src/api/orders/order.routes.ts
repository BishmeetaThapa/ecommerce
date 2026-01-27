import { Router } from 'express';
import * as orderController from './order.controller.js';

const router = Router();

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', orderController.updateOrderStatus);

export default router;
