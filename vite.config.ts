import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directoryName = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(directoryName, './src'),
    },
  },
  server: {
    watch: {
      ignored: ['**/.vs/**', '**/.git/**', '**/public/images/**'],
    },
  },
});
