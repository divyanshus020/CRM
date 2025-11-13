import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/v1/auth/register
router.post('/register', registerUser);

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
router.post('/login', loginUser);

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
router.get('/profile', isAuthenticated, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

export default router;