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
  plugins: [
    tailwindcss(),
    react(),
    copyPublicAssets,
    {
      name: 'copy-extension-scripts',
      closeBundle() {
        mkdirSync('dist/background', { recursive: true });
        copyFileSync(
          resolve(__dirname, 'src/background/service_worker.js'),
          resolve(__dirname, 'dist/background/service_worker.js')
        );
      }
    }
  ],
  build: {
    emptyOutDir: true,
    // Inline every asset as a data URI. The content script is injected into
    // arbitrary pages where relative/file URLs can't resolve, so self-contained
    // data URIs are the only reliable option.
    assetsInlineLimit: () => true,
    // Extract all CSS into a single file instead of injecting it into the host
    // page's <head>. We load this file inside a Shadow DOM so styles stay
    // isolated and never touch the host page.
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        'content/inject': resolve(__dirname, 'src/content/inject.tsx'),
      },
      output: {
        format: 'iife',
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'content/inject.css';
          }
          return 'assets/[name][extname]';
        }
      }
    }
  }
});
