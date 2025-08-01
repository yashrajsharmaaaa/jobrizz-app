import jwt, { type SignOptions } from 'jsonwebtoken';
import { validateEnv } from '../config/environment.js';

const env = validateEnv();

export interface TokenPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export class JWTService {
    private static readonly ACCESS_TOKEN_SECRET = env.JWT_SECRET;
    private static readonly REFRESH_TOKEN_SECRET = env.JWT_SECRET + '_refresh';
    private static readonly ACCESS_TOKEN_EXPIRES_IN = env.JWT_EXPIRES_IN;
    private static readonly REFRESH_TOKEN_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN;

    /**
     * Generate access token
     */
    static generateAccessToken(payload: TokenPayload): string {
        const options: SignOptions = {
            expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
        };

        return jwt.sign(
            { userId: payload.userId, email: payload.email },
            this.ACCESS_TOKEN_SECRET,
            options
        );
    }

    /**
     * Generate refresh token
     */
    static generateRefreshToken(payload: TokenPayload): string {
        const options: SignOptions = {
            expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
        };

        return jwt.sign(
            { userId: payload.userId, email: payload.email },
            this.REFRESH_TOKEN_SECRET,
            options
        );
    }

    /**
     * Generate both access and refresh tokens
     */
    static generateTokenPair(payload: TokenPayload): TokenPair {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }

    /**
     * Verify access token
     */
    static verifyAccessToken(token: string): TokenPayload | null {
        try {
            const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET) as TokenPayload;
            return decoded;
        } catch (error) {
            return null;
        }
    }

    /**
     * Verify refresh token
     */
    static verifyRefreshToken(token: string): TokenPayload | null {
        try {
            const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET) as TokenPayload;
            return decoded;
        } catch (error) {
            return null;
        }
    }

    /**
     * Extract token from Authorization header
     */
    static extractTokenFromHeader(authHeader: string | undefined): string | null {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7); // Remove 'Bearer ' prefix
    }

    /**
     * Get token expiration time
     */
    static getTokenExpiration(token: string): Date | null {
        try {
            const decoded = jwt.decode(token) as any;
            if (decoded && decoded.exp) {
                return new Date(decoded.exp * 1000);
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Check if token is expired
     */
    static isTokenExpired(token: string): boolean {
        const expiration = this.getTokenExpiration(token);
        if (!expiration) return true;
        return expiration < new Date();
    }
}