import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves this project from /superarmageddon/.
  // Vite uses '/' during local development and the repo path for production.
  base: process.env.GITHUB_ACTIONS ? '/superarmageddon/' : '/',
  plugins: [react()],
});
