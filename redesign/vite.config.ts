import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// Standalone design-only frontend (mock data, no app logic).
export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react(), tailwindcss()],
  server: { port: 3100, host: '0.0.0.0' },
  build: { outDir: path.resolve(__dirname, 'dist'), emptyOutDir: true },
});
