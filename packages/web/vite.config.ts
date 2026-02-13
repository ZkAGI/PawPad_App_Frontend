import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ registerType: 'autoUpdate' }),
  ],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../core'),
    },
  },
  server: {
    proxy: {
      '/tee-api': {
        target: 'https://p8080.m125.opf-mainnet-rofl-35.rofl.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tee-api/, ''),
        secure: true,
      },
    },
  },
});
