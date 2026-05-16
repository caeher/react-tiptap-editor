import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    root: 'playground',
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@caeher/react-tiptap-editor': resolve(__dirname, 'src/index.ts'),
      },
    },
    build: {
      outDir: '../dist-playground',
      emptyOutDir: true,
    }
  };
});
