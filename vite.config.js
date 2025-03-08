import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

import {resolve} from 'node:path';
import {TanStackRouterVite} from '@tanstack/router-plugin/vite';
import PluginObject from 'babel-plugin-react-compiler';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    [PluginObject],
    TanStackRouterVite({autoCodeSplitting: true}),
    viteReact(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
