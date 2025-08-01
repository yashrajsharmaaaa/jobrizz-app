/**
 * PDF.js Worker Configuration
 * Handles PDF.js worker setup with fallbacks for different environments
 */

import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

let workerInitialized = false;

/**
 * Initialize PDF.js worker with multiple fallback strategies
 */
export function initializePDFWorker(): void {
  if (workerInitialized) return;

  try {
    // Strategy 1: Use public directory worker (most reliable for Vite)
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.mjs';
    workerInitialized = true;
    console.log('PDF.js worker initialized with public directory worker');
    
  } catch (error) {
    console.warn('Failed to initialize public directory PDF worker, trying CDN fallback:', error);
    
    try {
      // Strategy 2: CDN fallback
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      workerInitialized = true;
      console.log('PDF.js worker initialized with CDN fallback');
      
    } catch (cdnError) {
      console.error('Failed to initialize PDF worker with CDN:', cdnError);
      
      try {
        // Strategy 3: Use local worker from node_modules
        const workerUrl = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
        
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
        workerInitialized = true;
        console.log('PDF.js worker initialized with local worker');
        
      } catch (localError) {
        console.error('Failed to initialize PDF worker with local worker:', localError);
        
        // Strategy 4: Disable worker (slower but works)
        pdfjsLib.GlobalWorkerOptions.workerSrc = '';
        workerInitialized = true;
        console.warn('PDF.js worker disabled, using main thread (slower performance)');
      }
    }
  }
}

/**
 * Get PDF document with proper error handling and fallbacks
 */
export async function getPDFDocument(data: ArrayBuffer): Promise<PDFDocumentProxy> {
  // Ensure worker is initialized
  initializePDFWorker();
  
  try {
    const loadingTask = pdfjsLib.getDocument({
      data,
      useSystemFonts: true,
      disableFontFace: false,
      verbosity: 0, // Reduce console noise
      isEvalSupported: false, // Disable eval for security
      maxImageSize: 16777216, // 16MB max image size
      cMapPacked: true,
    });

    // Set a timeout for the loading task
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('PDF loading timeout')), 30000); // 30 second timeout
    });

    return await Promise.race([loadingTask.promise, timeoutPromise]) as PDFDocumentProxy;
    
  } catch (error) {
    console.error('PDF loading failed with worker, trying without worker:', error);
    
    // Fallback: try without worker
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '';
      
      const fallbackLoadingTask = pdfjsLib.getDocument({
        data,
        useSystemFonts: true,
        disableFontFace: false,
        verbosity: 0,
        isEvalSupported: false,
        maxImageSize: 16777216,
        cMapPacked: true,
      });

      return await fallbackLoadingTask.promise as PDFDocumentProxy;
      
    } catch (fallbackError) {
      console.error('PDF loading failed even without worker:', fallbackError);
      throw new Error('Failed to load PDF document. The file may be corrupted or unsupported.');
    }
  }
}

/**
 * Check if PDF.js worker is properly initialized
 */
export function isWorkerInitialized(): boolean {
  return workerInitialized;
}