import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path for GitHub Pages when deployed under /repo-name
const base = process.env.GH_PAGES_BASE || process.env.npm_config_base || '/';

export default defineConfig({
  plugins: [react()],
  base,
});


