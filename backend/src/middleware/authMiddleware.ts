import { Request, Response, NextFunction } from 'express';
import { JWTService, TokenPayload } from '../services/jwtService.js';
import { UserService } from '../services/userService.js';
import { AppError } from './errorHandler.js';
import { logger } from '../utils/logger.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = JWTService.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new AppError('Access token required', 401, 'TOKEN_REQUIRED');
    }

    // Verify token
    const payload = JWTService.verifyAccessToken(token);
    if (!payload) {
      throw new AppError('Invalid or expired token', 401, 'INVALID_TOKEN');
    }

    // Get user from database
    const user = await UserService.getUserById(payload.userId);
    if (!user) {
      throw new AppError('User not found', 401, 'USER_NOT_FOUND');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Authentication error:', error);
      next(new AppError('Authentication failed', 401, 'AUTH_FAILED'));
    }
  }
}

/**
 * Middleware to optionally authenticate JWT tokens
 * If token is present, it will be validated, but if not present, request continues
 */
export async function optionalAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = JWTService.extractTokenFromHeader(authHeader);

    if (!token) {
      // No token provided, continue without authentication
      next();
      return;
    }

    // Verify token if provided
    const payload = JWTService.verifyAccessToken(token);
    if (payload) {
      const user = await UserService.getUserById(payload.userId);
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Log error but don't fail the request for optional authentication
    logger.warn('Optional authentication failed:', error);
    next();
  }
}

/**
 * Middleware to check if user owns a resource
 * Must be used after authenticateToken middleware
 */
export function requireResourceOwnership(resourceUserIdParam: string = 'userId') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
      }

      const resourceUserId = req.params[resourceUserIdParam];
      
      if (!resourceUserId) {
        throw new AppError('Resource user ID not found', 400, 'RESOURCE_USER_ID_MISSING');
      }

      if (req.user.id !== resourceUserId) {
        throw new AppError('Access denied: insufficient permissions', 403, 'ACCESS_DENIED');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware to check if user has admin role
 * Must be used after authenticateToken middleware
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
    }

    // For now, we don't have admin roles in the schema
    // This is a placeholder for future implementation
    // You could add an 'isAdmin' field to the User model
    
    // Example implementation:
    // if (!req.user.isAdmin) {
    //   throw new AppError('Admin access required', 403, 'ADMIN_REQUIRED');
    // }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware to rate limit authentication attempts
 */
export function authRateLimit(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    const clientAttempts = attempts.get(clientId);
    
    if (!clientAttempts || now > clientAttempts.resetTime) {
      // Reset or initialize attempts
      attempts.set(clientId, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }
    
    if (clientAttempts.count >= maxAttempts) {
      throw new AppError(
        `Too many authentication attempts. Try again in ${Math.ceil((clientAttempts.resetTime - now) / 60000)} minutes.`,
        429,
        'TOO_MANY_ATTEMPTS'
      );
    }
    
    clientAttempts.count++;
    next();
  };
}

/**
 * Middleware to validate request data using Zod schemas
 */
export function validateRequest(schema: any) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Replace request data with validated data
      req.body = validatedData.body || req.body;
      req.query = validatedData.query || req.query;
      req.params = validatedData.params || req.params;

      next();
    } catch (error) {
      next(error); // This will be handled by the error handler middleware
    }
  };
}