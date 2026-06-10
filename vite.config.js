import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    // Added 'qrcode' and 'jspdf' here to ensure Vite pre-bundles them
    include: ['react', 'react-dom', '@supabase/supabase-js', 'qrcode', 'jspdf'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});