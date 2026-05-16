import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  minify: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@tiptap/core',
    '@tiptap/react',
    '@tiptap/pm',
    '@tiptap/starter-kit',
    '@tiptap/extension-placeholder',
    '@tiptap/extension-link',
    '@tiptap/extension-image',
    '@tiptap/extension-table',
    '@tiptap/extension-underline',
    '@tiptap/extension-typography',
    '@tiptap/extension-list',
    '@tiptap/extension-dropcursor',
    '@tiptap/suggestion',
    'shiki',
    'tiptap-extension-code-block-shiki',
    'tiptap-markdown',
    'lucide-react'
  ],
  sourcemap: true,
  treeshake: true,
  shims: true,
});
