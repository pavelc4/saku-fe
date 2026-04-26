import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite' 

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(), 
      tailwindcss(),
      Icons({ 
        compiler: 'vue3',
        autoInstall: true 
      }),
    ],

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },

    server: {
      port: 5173,
      host: true, 
      proxy: {
        '/files': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8787',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/files/, ''),
        },
      },
    },

    build: {
      target: 'esnext',
      minify: 'esbuild',
      emptyOutDir: true,
      reportCompressedSize: false,
      cssCodeSplit: true,
      sourcemap: false,
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Core framework
              if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
                return 'vendor-core';
              }
              // Heavy PDF logic (if not dynamically imported already)
              if (id.includes('html2pdf.js') || id.includes('jspdf') || id.includes('html2canvas')) {
                return 'vendor-pdf';
              }
              // UI Components or icons
              if (id.includes('@vueuse') || id.includes('unplugin-icons')) {
                return 'vendor-ui';
              }
              // Utilities
              if (id.includes('axios') || id.includes('@js-temporal')) {
                return 'vendor-utils';
              }
              return 'vendor-libs';
            }
          },
        },
      },
    },

    test: {
      environment: 'happy-dom', 
      globals: true,
      include: ['src/tests/**/*.test.ts'],
      exclude: ['saku/**'],
      setupFiles: ['src/tests/setup.ts'],
    },
  }
})
