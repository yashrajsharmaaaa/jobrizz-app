import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateToken, validateRequest, authRateLimit } from '../middleware/authMiddleware.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateUserSchema,
} from '../validators/authValidators.js';

const router = Router();

// Apply rate limiting to authentication routes
const authLimiter = authRateLimit(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  authLimiter,
  validateRequest(registerSchema),
  AuthController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  authLimiter,
  validateRequest(loginSchema),
  AuthController.login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh',
  validateRequest(refreshTokenSchema),
  AuthController.refreshToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post(
  '/logout',
  validateRequest(refreshTokenSchema),
  AuthController.logout
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/profile',
  authenticateToken,
  AuthController.getProfile
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  authenticateToken,
  validateRequest(updateUserSchema),
  AuthController.updateProfile
);

/**
 * @route   DELETE /api/auth/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete(
  '/account',
  authenticateToken,
  AuthController.deleteAccount
);

/**
 * @route   GET /api/auth/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get(
  '/stats',
  authenticateToken,
  AuthController.getUserStats
);

export default router;