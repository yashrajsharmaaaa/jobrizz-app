/**
 * Data Service - Handles data persistence with fallback strategies
 * This service provides a consistent interface for data storage that works
 * both with local storage (current) and database (future)
 */

import { ResumeAnalysis } from '../types/analysis';
import { APIClient, ResumeService } from './apiClient';
import { FALLBACK_CONFIG } from '../config/api';

export interface StorageOptions {
  useServer?: boolean;
  userId?: string;
  encrypt?: boolean;
}

export class DataService {
  private static readonly STORAGE_KEYS = {
    RESUME_ANALYSIS: 'jobrizz_resume_analysis',
    USER_PREFERENCES: 'jobrizz_user_preferences',
    EXPORT_HISTORY: 'jobrizz_export_history',
    OFFLINE_QUEUE: 'jobrizz_offline_queue',
  };

  /**
   * Save resume analysis data
   */
  static async saveResumeAnalysis(
    analysis: ResumeAnalysis,
    options: StorageOptions = {}
  ): Promise<void> {
    const serverAvailable = await APIClient.isServerAvailable();
    
    if (serverAvailable && options.useServer && options.userId) {
      try {
        // Save to server database
        await ResumeService.updateResume(analysis.id, {
          analysis,
          updatedAt: new Date().toISOString(),
        });
        
        // Also save locally as backup
        if (FALLBACK_CONFIG.USE_LOCAL_STORAGE) {
          this.saveToLocalStorage(this.STORAGE_KEYS.RESUME_ANALYSIS, analysis);
        }
      } catch (error) {
        console.warn('Server save failed, using local storage:', error);
        this.saveToLocalStorage(this.STORAGE_KEYS.RESUME_ANALYSIS, analysis);
      }
    } else {
      // Save to local storage
      this.saveToLocalStorage(this.STORAGE_KEYS.RESUME_ANALYSIS, analysis);
      
      // Queue for server sync when available
      if (options.useServer) {
        this.queueForSync('saveResumeAnalysis', { analysis, options });
      }
    }
  }

  /**
   * Load resume analysis data
   */
  static async loadResumeAnalysis(
    analysisId: string,
    options: StorageOptions = {}
  ): Promise<ResumeAnalysis | null> {
    const serverAvailable = await APIClient.isServerAvailable();
    
    if (serverAvailable && options.useServer && options.userId) {
      try {
        const response = await ResumeService.getResume(analysisId);
        if (response.success && response.data) {
          return response.data.analysis;
        }
      } catch (error) {
        console.warn('Server load failed, trying local storage:', error);
      }
    }
    
    // Fallback to local storage
    return this.loadFromLocalStorage(this.STORAGE_KEYS.RESUME_ANALYSIS);
  }

  /**
   * Save user preferences
   */
  static async saveUserPreferences(preferences: any, userId?: string): Promise<void> {
    if (userId) {
      // TODO: Save to server when user service is implemented
      console.log('Saving preferences for user:', userId);
    }
    
    this.saveToLocalStorage(this.STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  /**
   * Load user preferences
   */
  static async loadUserPreferences(userId?: string): Promise<any> {
    if (userId) {
      // TODO: Load from server when user service is implemented
      console.log('Loading preferences for user:', userId);
    }
    
    return this.loadFromLocalStorage(this.STORAGE_KEYS.USER_PREFERENCES) || {};
  }

  /**
   * Save export history
   */
  static async saveExportHistory(exportData: any): Promise<void> {
    const history = this.loadFromLocalStorage(this.STORAGE_KEYS.EXPORT_HISTORY) || [];
    history.unshift({
      ...exportData,
      timestamp: new Date().toISOString(),
    });
    
    // Keep only last 50 exports
    const trimmedHistory = history.slice(0, 50);
    this.saveToLocalStorage(this.STORAGE_KEYS.EXPORT_HISTORY, trimmedHistory);
  }

  /**
   * Get export history
   */
  static getExportHistory(): any[] {
    return this.loadFromLocalStorage(this.STORAGE_KEYS.EXPORT_HISTORY) || [];
  }

  /**
   * Clear all local data
   */
  static clearLocalData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Sync offline data when connection is restored
   */
  static async syncOfflineData(): Promise<void> {
    if (!FALLBACK_CONFIG.SYNC_ON_RECONNECT) return;
    
    const serverAvailable = await APIClient.isServerAvailable();
    if (!serverAvailable) return;

    const offlineQueue = this.loadFromLocalStorage(this.STORAGE_KEYS.OFFLINE_QUEUE) || [];
    
    for (const item of offlineQueue) {
      try {
        switch (item.action) {
          case 'saveResumeAnalysis':
            await this.saveResumeAnalysis(item.data.analysis, item.data.options);
            break;
          // Add other sync actions as needed
        }
      } catch (error) {
        console.error('Failed to sync offline item:', item, error);
      }
    }
    
    // Clear synced items
    this.saveToLocalStorage(this.STORAGE_KEYS.OFFLINE_QUEUE, []);
  }

  /**
   * Queue action for later sync
   */
  private static queueForSync(action: string, data: any): void {
    if (!FALLBACK_CONFIG.SYNC_ON_RECONNECT) return;
    
    const queue = this.loadFromLocalStorage(this.STORAGE_KEYS.OFFLINE_QUEUE) || [];
    queue.push({
      action,
      data,
      timestamp: new Date().toISOString(),
    });
    
    this.saveToLocalStorage(this.STORAGE_KEYS.OFFLINE_QUEUE, queue);
  }

  /**
   * Save data to local storage
   */
  private static saveToLocalStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to local storage:', error);
    }
  }

  /**
   * Load data from local storage
   */
  private static loadFromLocalStorage(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load from local storage:', error);
      return null;
    }
  }

  /**
   * Get storage usage statistics
   */
  static getStorageStats(): {
    used: number;
    available: number;
    percentage: number;
  } {
    let used = 0;
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length;
      }
    }
    
    // Estimate available storage (5MB typical limit)
    const available = 5 * 1024 * 1024; // 5MB in bytes
    const percentage = (used / available) * 100;
    
    return { used, available, percentage };
  }
}

/**
 * Initialize data service and set up sync
 */
export function initializeDataService(): void {
  // Set up periodic sync check
  if (FALLBACK_CONFIG.SYNC_ON_RECONNECT) {
    setInterval(async () => {
      await DataService.syncOfflineData();
    }, 60000); // Check every minute
  }

  // Sync on page load
  DataService.syncOfflineData();
  
  // Sync when online status changes
  window.addEventListener('online', () => {
    DataService.syncOfflineData();
  });
}