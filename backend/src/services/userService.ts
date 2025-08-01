import { User } from '@prisma/client';
import { prisma } from '../config/database.js';
import { PasswordService } from './passwordService.js';
import { JWTService, TokenPair } from './jwtService.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

export interface CreateUserData {
    email: string;
    password: string;
    name: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface UserWithoutPassword extends Omit<User, 'password'> { }

export class UserService {
    /**
     * Create a new user
     */
    static async createUser(userData: CreateUserData): Promise<UserWithoutPassword> {
        try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: userData.email.toLowerCase() }
            });

            if (existingUser) {
                throw new AppError('User with this email already exists', 409, 'USER_EXISTS');
            }

            // Validate password strength
            const passwordValidation = PasswordService.validatePasswordStrength(userData.password);
            if (!passwordValidation.isValid) {
                throw new AppError(
                    `Password validation failed: ${passwordValidation.errors.join(', ')}`,
                    400,
                    'WEAK_PASSWORD'
                );
            }

            // Hash password
            const hashedPassword = await PasswordService.hashPassword(userData.password);

            // Create user
            const user = await prisma.user.create({
                data: {
                    email: userData.email.toLowerCase(),
                    password: hashedPassword,
                    name: userData.name.trim(),
                },
            });

            logger.info(`New user created: ${user.email}`);

            // Return user without password
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Error creating user:', error);
            throw new AppError('Failed to create user', 500, 'USER_CREATION_FAILED');
        }
    }

    /**
     * Authenticate user and return tokens
     */
    static async loginUser(credentials: LoginCredentials): Promise<{
        user: UserWithoutPassword;
        tokens: TokenPair;
    }> {
        try {
            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email: credentials.email.toLowerCase() }
            });

            if (!user) {
                throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
            }

            // Verify password
            const isPasswordValid = await PasswordService.comparePassword(
                credentials.password,
                user.password
            );

            if (!isPasswordValid) {
                throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
            }

            // Generate tokens
            const tokens = JWTService.generateTokenPair({
                userId: user.id,
                email: user.email,
            });

            // Store refresh token in database
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

            await prisma.userSession.create({
                data: {
                    userId: user.id,
                    refreshToken: tokens.refreshToken,
                    expiresAt,
                },
            });

            logger.info(`User logged in: ${user.email}`);

            // Return user without password
            const { password, ...userWithoutPassword } = user;
            return {
                user: userWithoutPassword,
                tokens,
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Error during login:', error);
            throw new AppError('Login failed', 500, 'LOGIN_FAILED');
        }
    }

    /**
     * Refresh access token
     */
    static async refreshToken(refreshToken: string): Promise<TokenPair> {
        try {
            // Verify refresh token
            const payload = JWTService.verifyRefreshToken(refreshToken);
            if (!payload) {
                throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
            }

            // Check if refresh token exists in database
            const session = await prisma.userSession.findUnique({
                where: { refreshToken },
                include: { user: true },
            });

            if (!session || session.expiresAt < new Date()) {
                throw new AppError('Refresh token expired or invalid', 401, 'REFRESH_TOKEN_EXPIRED');
            }

            // Generate new tokens
            const newTokens = JWTService.generateTokenPair({
                userId: session.user.id,
                email: session.user.email,
            });

            // Update refresh token in database
            const newExpiresAt = new Date();
            newExpiresAt.setDate(newExpiresAt.getDate() + 7);

            await prisma.userSession.update({
                where: { id: session.id },
                data: {
                    refreshToken: newTokens.refreshToken,
                    expiresAt: newExpiresAt,
                },
            });

            logger.info(`Token refreshed for user: ${session.user.email}`);

            return newTokens;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Error refreshing token:', error);
            throw new AppError('Token refresh failed', 500, 'TOKEN_REFRESH_FAILED');
        }
    }

    /**
     * Logout user (invalidate refresh token)
     */
    static async logoutUser(refreshToken: string): Promise<void> {
        try {
            await prisma.userSession.deleteMany({
                where: { refreshToken },
            });

            logger.info('User logged out successfully');
        } catch (error) {
            logger.error('Error during logout:', error);
            throw new AppError('Logout failed', 500, 'LOGOUT_FAILED');
        }
    }

    /**
     * Get user by ID
     */
    static async getUserById(userId: string): Promise<UserWithoutPassword | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                return null;
            }

            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            logger.error('Error fetching user:', error);
            throw new AppError('Failed to fetch user', 500, 'USER_FETCH_FAILED');
        }
    }

    /**
     * Update user profile
     */
    static async updateUser(
        userId: string,
        updates: Partial<Pick<User, 'name' | 'email'>>
    ): Promise<UserWithoutPassword> {
        try {
            // If email is being updated, check if it's already taken
            if (updates.email) {
                const existingUser = await prisma.user.findFirst({
                    where: {
                        email: updates.email.toLowerCase(),
                        NOT: { id: userId },
                    },
                });

                if (existingUser) {
                    throw new AppError('Email already in use', 409, 'EMAIL_IN_USE');
                }
            }

            const user = await prisma.user.update({
                where: { id: userId },
                data: {
                    ...(updates.name && { name: updates.name.trim() }),
                    ...(updates.email && { email: updates.email.toLowerCase() }),
                },
            });

            logger.info(`User updated: ${user.email}`);

            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Error updating user:', error);
            throw new AppError('Failed to update user', 500, 'USER_UPDATE_FAILED');
        }
    }

    /**
     * Delete user account
     */
    static async deleteUser(userId: string): Promise<void> {
        try {
            await prisma.user.delete({
                where: { id: userId },
            });

            logger.info(`User deleted: ${userId}`);
        } catch (error) {
            logger.error('Error deleting user:', error);
            throw new AppError('Failed to delete user', 500, 'USER_DELETE_FAILED');
        }
    }

    /**
     * Clean up expired sessions
     */
    static async cleanupExpiredSessions(): Promise<void> {
        try {
            const result = await prisma.userSession.deleteMany({
                where: {
                    expiresAt: {
                        lt: new Date(),
                    },
                },
            });

            logger.info(`Cleaned up ${result.count} expired sessions`);
        } catch (error) {
            logger.error('Error cleaning up expired sessions:', error);
        }
    }
}