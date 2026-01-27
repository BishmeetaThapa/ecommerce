import { Router } from 'express';
import * as userController from './user.controller.js';

const router = Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id/role', userController.updateUserRole);
router.delete('/:id', userController.deleteUser);

export default router;
