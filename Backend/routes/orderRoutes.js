// Backend/routes/orderRoutes.js
import express from 'express';
import { addOrderItems, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/orders (place order, logged-in user)
router.post('/', protect, addOrderItems);

// GET /api/orders/myOrders (fetch personal order history, logged-in user)
router.get('/myOrders', protect, getMyOrders);

export default router;
