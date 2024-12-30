import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { patchCssModules } from 'vite-css-modules';

export default defineConfig({
  // TODO: Test code will eleminated, here... just dont need here...
  plugins: [
    tsconfigPaths(),
    patchCssModules(),
    react(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/vitest.setup.ts',
    css: true,
    watch: false,
    coverage: {
      exclude: ['**/node_modules/**', '**/dist/**', '**/your-folder-to-ignore/**', '**/__mocks__/**', '**/__tests__/**', '**/constants/**', '**/interfaces/**', '**/models/**', '**/router/**', '**/deprecated/**', '**/vite.config.ts', '**/eslint.config.js', '**/src/main.tsx', '**/src/vite-env.d.ts'],
    },
  },
  optimizeDeps: {
    include: ['react-pdf']
  },
  build: {
    target: 'es2022',
    commonjsOptions: {
      include: [/react-pdf/, /node_modules/]
    }
  },

  // TODO: WTF?
  server: {
    proxy: {
      '/backend': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, '')
      },
      '/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ollama/, '')
      }
    }
  }
})
