import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService.js';
import { AppError } from '../middleware/errorHandler.js';
import { User } from '@prisma/client';

import {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  UpdateUserRequest,
} from '../validators/authValidators.js';

export class AuthController {
  /**
   * Register a new user
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: RegisterRequest = req.body;

      const user = await UserService.createUser(userData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const credentials: LoginRequest = req.body;

      const result = await UserService.loginUser(credentials);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken }: RefreshTokenRequest = req.body;

      const tokens = await UserService.refreshToken(refreshToken);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken }: RefreshTokenRequest = req.body;

      await UserService.logoutUser(refreshToken);

      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      res.json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const updates: UpdateUserRequest = req.body;
      
      // Filter out undefined values
      const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      ) as Partial<Pick<User, 'name' | 'email'>>;

      const updatedUser = await UserService.updateUser(req.user.id, filteredUpdates);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: updatedUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      await UserService.deleteUser(req.user.id);

      res.json({
        success: true,
        message: 'Account deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user statistics (for admin or analytics)
   */
  static async getUserStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      // This could include resume count, last login, etc.
      // For now, just return basic user info
      res.json({
        success: true,
        data: {
          user: req.user,
          stats: {
            accountCreated: req.user.createdAt,
            lastUpdated: req.user.updatedAt,
            // Add more stats as needed
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}