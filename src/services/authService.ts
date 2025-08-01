import { APIClient } from './apiClient';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterData): Promise<User> {
    try {
      console.log('Registering user with data:', data);
      const response = await APIClient.post<{ user: User }>('/api/auth/register', data);
      console.log('Registration response:', response);
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  /**
   * Login user
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await APIClient.post<AuthResponse>('/api/auth/login', credentials);
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      
      // Store tokens and user data
      APIClient.setAuthTokens(response.data.accessToken, response.data.refreshToken);
      this.setUser(response.data.user);
      
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await APIClient.post('/api/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      // Always clear local storage
      APIClient.clearAuthTokens();
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<User> {
    try {
      const response = await APIClient.get<{ user: User }>('/api/auth/profile');
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      this.setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get profile');
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: Partial<Pick<User, 'name' | 'email'>>): Promise<User> {
    try {
      const response = await APIClient.put<{ user: User }>('/api/auth/profile', updates);
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      this.setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(): Promise<void> {
    try {
      await APIClient.delete('/api/auth/account');
      APIClient.clearAuthTokens();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete account');
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  /**
   * Get current user from storage
   */
  static getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  /**
   * Set user data in storage
   */
  private static setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Validate password strength (client-side check)
   */
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}