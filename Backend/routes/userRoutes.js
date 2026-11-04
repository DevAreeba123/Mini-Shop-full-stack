// Backend/routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Public routes for user registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
