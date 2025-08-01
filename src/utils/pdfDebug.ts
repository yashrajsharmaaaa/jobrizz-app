/**
 * PDF Debug utilities to help diagnose PDF processing issues
 */

import { isWorkerInitialized } from './pdfWorker';

export interface PDFDebugInfo {
  workerInitialized: boolean;
  workerSrc: string;
  browserSupport: {
    arrayBuffer: boolean;
    webWorkers: boolean;
    fetch: boolean;
  };
  environment: {
    userAgent: string;
    isSecureContext: boolean;
    origin: string;
  };
}

/**
 * Get comprehensive debug information about PDF processing environment
 */
export function getPDFDebugInfo(): PDFDebugInfo {
  return {
    workerInitialized: isWorkerInitialized(),
    workerSrc: (globalThis as any).pdfjsLib?.GlobalWorkerOptions?.workerSrc || 'Not set',
    browserSupport: {
      arrayBuffer: typeof ArrayBuffer !== 'undefined',
      webWorkers: typeof Worker !== 'undefined',
      fetch: typeof fetch !== 'undefined',
    },
    environment: {
      userAgent: navigator.userAgent,
      isSecureContext: window.isSecureContext,
      origin: window.location.origin,
    },
  };
}

/**
 * Test if PDF worker is accessible
 */
export async function testPDFWorkerAccess(): Promise<{ success: boolean; error?: string }> {
  try {
    // Test if we can fetch the worker file
    const workerUrl = '/js/pdf.worker.min.mjs';
    const response = await fetch(workerUrl, { method: 'HEAD' });
    
    if (!response.ok) {
      return {
        success: false,
        error: `Worker file not accessible: ${response.status} ${response.statusText}`,
      };
    }
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Log debug information to console
 */
export function logPDFDebugInfo(): void {
  const debugInfo = getPDFDebugInfo();
  console.group('PDF Debug Information');
  console.log('Worker Initialized:', debugInfo.workerInitialized);
  console.log('Worker Source:', debugInfo.workerSrc);
  console.log('Browser Support:', debugInfo.browserSupport);
  console.log('Environment:', debugInfo.environment);
  console.groupEnd();
}