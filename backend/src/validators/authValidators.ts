import { z } from 'zod';

// User registration validation
export const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email format')
      .max(255, 'Email must be less than 255 characters')
      .transform(email => email.toLowerCase()),
    
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must be less than 128 characters long'),
    
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be less than 100 characters')
      .transform(name => name.trim()),
  }),
});

// User login validation
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email format')
      .transform(email => email.toLowerCase()),
    
    password: z
      .string()
      .min(1, 'Password is required'),
  }),
});

// Refresh token validation
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z
      .string()
      .min(1, 'Refresh token is required'),
  }),
});

// Update user profile validation
export const updateUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name cannot be empty')
      .max(100, 'Name must be less than 100 characters')
      .transform(name => name.trim())
      .optional(),
    
    email: z
      .string()
      .email('Invalid email format')
      .max(255, 'Email must be less than 255 characters')
      .transform(email => email.toLowerCase())
      .optional(),
  }).refine(
    (data) => Object.keys(data).length > 0,
    {
      message: 'At least one field must be provided for update',
    }
  ),
});

// Change password validation
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long')
      .max(128, 'New password must be less than 128 characters long'),
    
    confirmPassword: z
      .string()
      .min(1, 'Password confirmation is required'),
  }).refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: 'New password and confirmation do not match',
      path: ['confirmPassword'],
    }
  ),
});

// Password reset request validation
export const passwordResetRequestSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email format')
      .transform(email => email.toLowerCase()),
  }),
});

// Password reset validation
export const passwordResetSchema = z.object({
  body: z.object({
    token: z
      .string()
      .min(1, 'Reset token is required'),
    
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must be less than 128 characters long'),
    
    confirmPassword: z
      .string()
      .min(1, 'Password confirmation is required'),
  }).refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: 'Password and confirmation do not match',
      path: ['confirmPassword'],
    }
  ),
});

// Types for TypeScript
export type RegisterRequest = z.infer<typeof registerSchema>['body'];
export type LoginRequest = z.infer<typeof loginSchema>['body'];
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>['body'];
export type UpdateUserRequest = z.infer<typeof updateUserSchema>['body'];
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>['body'];
export type PasswordResetRequestRequest = z.infer<typeof passwordResetRequestSchema>['body'];
export type PasswordResetRequest = z.infer<typeof passwordResetSchema>['body'];