import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { prefixBrowserPaths } from './src/lib/academyRouting.mjs';

export default defineConfig({
  base: '/academy/',
  plugins: [
    { name:'scope-academy-browser-paths', enforce:'pre', transform(code, id) {
      const filepath = id.split('?')[0];
      if (!filepath.includes('/src/') || !['.ts','.tsx','.js','.jsx','.mjs','.mts'].some(ext=>filepath.endsWith(ext)) || filepath.includes('/src/worker/')) return null;
      const scoped = prefixBrowserPaths(code);
      return scoped === code ? null : { code: scoped, map: null };
    } },
    react()
  ],
  server: { proxy: { '/api': 'http://127.0.0.1:8788', '/academy/api': {target:'http://127.0.0.1:8788',rewrite:path=>path.slice('/academy'.length)} } },
  build: { sourcemap: false }
});
