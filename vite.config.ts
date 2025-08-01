import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],

    // Development server configuration
    server: {
      port: 5173,
      host: true,
      open: true,
    },

    // Preview server configuration
    preview: {
      port: 4173,
      host: true,
    },

    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'esbuild' : false,
      target: 'esnext',

      // Optimize bundle size
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom'],
            'router-vendor': ['react-router-dom'],
            'ui-vendor': ['@headlessui/react', '@heroicons/react'],
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'dnd-vendor': ['react-dnd', 'react-dnd-html5-backend', 'react-dnd-touch-backend'],
            'file-vendor': ['react-dropzone', 'file-saver'],
            'pdf-vendor': ['pdfjs-dist', 'mammoth'],
            'utils-vendor': ['clsx', 'tailwind-merge', 'uuid'],
          },
          // Optimize chunk file names
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
              : 'chunk'
            return `js/${facadeModuleId}-[hash].js`
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || []
            const ext = info[info.length - 1]
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
              return `images/[name]-[hash][extname]`
            }
            if (/css/i.test(ext || '')) {
              return `css/[name]-[hash][extname]`
            }
            // Handle PDF.js worker files
            if (assetInfo.name?.includes('pdf.worker')) {
              return `js/[name]-[hash][extname]`
            }
            return `assets/[name]-[hash][extname]`
          },
        },
      },

      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
    },

    // Path resolution
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@services': resolve(__dirname, 'src/services'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@types': resolve(__dirname, 'src/types'),
        '@config': resolve(__dirname, 'src/config'),
        '@constants': resolve(__dirname, 'src/constants'),
      },
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    // Optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@headlessui/react',
        '@heroicons/react/24/outline',
        'react-dropzone',
        'pdfjs-dist',
      ],
      exclude: [
        'pdfjs-dist/build/pdf.worker.min.js',
        'pdfjs-dist/build/pdf.worker.min.mjs',
      ],
    },

    // Worker configuration for PDF.js
    worker: {
      format: 'es',
      rollupOptions: {
        external: ['pdfjs-dist/build/pdf.worker.min.mjs'],
      },
    },

    // CSS configuration
    css: {
      devSourcemap: mode !== 'production',
    },
  }
})