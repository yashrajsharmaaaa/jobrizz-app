/**
 * API Client for Backend Communication
 * This service handles all HTTP requests and provides a consistent interface
 * for both current client-side operations and future server-side integration
 */

import { API_CONFIG, API_ENDPOINTS, type APIResponse } from '../config/api';

export class APIClient {
  private static baseURL = API_CONFIG.BASE_URL;
  private static timeout = API_CONFIG.TIMEOUT;

  /**
   * Generic HTTP request method with automatic token refresh
   */
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add auth token when available
    const token = this.getAuthToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle token expiration
      if (response.status === 401 && retryCount === 0) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.request<T>(endpoint, options, retryCount + 1);
        } else {
          // Refresh failed, clear tokens and redirect to login
          this.clearAuthTokens();
          window.location.href = '/login';
          throw new Error('Authentication expired');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          url
        });
        throw new Error(errorData.error?.message || errorData.message || `HTTP ${response.status}`);
      }

      const responseData = await response.json();
      console.log('API Response:', { url, responseData });
      return responseData;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  static async get<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  static async post<T>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  static async put<T>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  static async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * File upload request
   */
  static async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<APIResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
      });
    }

    const token = this.getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    });
  }

  /**
   * Check if server is available
   */
  static async isServerAvailable(): Promise<boolean> {
    try {
      await this.get(API_ENDPOINTS.HEALTH);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get authentication token from storage
   */
  private static getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get refresh token from storage
   */
  private static getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Set authentication tokens
   */
  static setAuthTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * Clear authentication tokens
   */
  static clearAuthTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  /**
   * Refresh access token
   */
  static async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      this.setAuthTokens(data.data.accessToken, data.data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Resume Service - handles all resume-related API calls
 */
export class ResumeService {
  /**
   * Upload and analyze resume (future server-side implementation)
   */
  static async uploadAndAnalyze(file: File): Promise<APIResponse<any>> {
    const serverAvailable = await APIClient.isServerAvailable();
    
    if (serverAvailable) {
      // Server-side upload and analysis
      return APIClient.upload(API_ENDPOINTS.RESUME.UPLOAD, file);
    } else {
      // Client-side fallback (current implementation)
      // This will use the existing ResumeParser
      throw new Error('Server not available - using client-side processing');
    }
  }

  /**
   * Get resume by ID
   */
  static async getResume(id: string): Promise<APIResponse<any>> {
    return APIClient.get(API_ENDPOINTS.RESUME.GET.replace(':id', id));
  }

  /**
   * List user's resumes
   */
  static async listResumes(): Promise<APIResponse<any[]>> {
    return APIClient.get(API_ENDPOINTS.RESUME.LIST);
  }

  /**
   * Update resume
   */
  static async updateResume(id: string, data: any): Promise<APIResponse<any>> {
    return APIClient.put(API_ENDPOINTS.RESUME.UPDATE.replace(':id', id), data);
  }

  /**
   * Delete resume
   */
  static async deleteResume(id: string): Promise<APIResponse<void>> {
    return APIClient.delete(API_ENDPOINTS.RESUME.DELETE.replace(':id', id));
  }
}

/**
 * Export Service - handles PDF/DOCX export
 */
export class ExportService {
  /**
   * Export resume as PDF
   */
  static async exportPDF(resumeId: string, version: 'original' | 'corrected'): Promise<APIResponse<any>> {
    return APIClient.post(API_ENDPOINTS.EXPORT.PDF, {
      resumeId,
      version,
      format: 'pdf',
    });
  }

  /**
   * Get export status
   */
  static async getExportStatus(exportId: string): Promise<APIResponse<any>> {
    return APIClient.get(API_ENDPOINTS.EXPORT.STATUS.replace(':id', exportId));
  }

  /**
   * Download exported file
   */
  static async downloadFile(exportId: string): Promise<void> {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.EXPORT.DOWNLOAD.replace(':id', exportId)}`;
    window.open(url, '_blank');
  }
}

/**
 * AI Service - handles AI-powered features
 */
export class AIService {
  /**
   * Get AI recommendations
   */
  static async getRecommendations(resumeContent: string): Promise<APIResponse<any>> {
    return APIClient.post(API_ENDPOINTS.AI.RECOMMENDATIONS, {
      content: resumeContent,
    });
  }

  /**
   * Get AI corrections
   */
  static async getCorrections(resumeContent: string): Promise<APIResponse<any>> {
    return APIClient.post(API_ENDPOINTS.AI.CORRECT, {
      content: resumeContent,
    });
  }

  /**
   * Match resume with job descriptions
   */
  static async matchJobs(resumeContent: string, jobDescriptions: string[]): Promise<APIResponse<any>> {
    return APIClient.post(API_ENDPOINTS.AI.JOB_MATCH, {
      resumeContent,
      jobDescriptions,
    });
  }
}