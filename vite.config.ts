import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { prefixBrowserPaths } from './src/lib/academyRouting.mjs';

export default defineConfig({
  base: '/academy/',
  plugins: [
    { name:'scope-academy-browser-paths', enforce:'pre', transform(code, id) {
      if (!/[\\/]src[\\/].*\\.[cm]?[jt]sx?(?:\\?.*)?$/.test(id) || /[\\/]src[\\/]worker[\\/]/.test(id)) return null;
      const scoped = prefixBrowserPaths(code);
      return scoped === code ? null : { code: scoped, map: null };
    } },
    react()
  ],
  server: { proxy: { '/api': 'http://127.0.0.1:8788', '/academy/api': {target:'http://127.0.0.1:8788',rewrite:path=>path.replace(/^\\/academy(?=\\/api\\/)/,'')} } },
  build: { sourcemap: false }
});
