import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile 
} from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', isAuthenticated, getUserProfile);

export default router;
