import { Router } from 'express';
import * as productController from './product.controller.js';
import * as categoryController from './category.controller.js';
import * as brandController from './brand.controller.js';

const router = Router();

// Categories
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:slug', categoryController.getCategoryBySlug);
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// Brands
router.get('/brands', brandController.getAllBrands);

// Products
router.get('/', productController.getAllProducts);
router.get('/:slug', productController.getProductBySlug);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
