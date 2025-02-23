import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist', // Ensures the build files are placed in "dist"
    assetsDir: 'assets', // Optional: Moves assets into "dist/assets"
  },
  assetsInclude: ['**/*.png'],
});
