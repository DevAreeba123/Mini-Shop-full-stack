// Backend/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Verifies JWT from "Authorization: Bearer <token>" and attaches user to req.user
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No token sent
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];

    // Throws error if token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB without password field
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

// Allows only given roles, e.g. authorize('admin')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, please log in first' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: access denied' });
    }

    next();
  };
};