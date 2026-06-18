import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync } from 'fs';

const copyPublicAssets = {
  name: 'copy-public-assets',
  closeBundle() {
    const publicDir = resolve(__dirname, 'public');
    const distDir = resolve(__dirname, 'dist');

    const copyDirRecursive = (src, dest) => {
      mkdirSync(dest, { recursive: true });
      readdirSync(src, { withFileTypes: true }).forEach(file => {
        const srcPath = resolve(src, file.name);
        const destPath = resolve(dest, file.name);
        if (file.isDirectory()) {
          copyDirRecursive(srcPath, destPath);
        } else {
          copyFileSync(srcPath, destPath);
        }
      });
    };

    copyDirRecursive(publicDir, distDir);
  }
};

export default defineConfig({
  base: './',
  plugins: [tailwindcss(), react(), copyPublicAssets],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});
