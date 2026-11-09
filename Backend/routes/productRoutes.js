// Backend/routes/productRoutes.js
import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/products - public | POST /api/products - admin only
router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

// GET /api/products/:id - public | DELETE /api/products/:id - admin only
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, authorize('admin'), deleteProduct);

export default router;