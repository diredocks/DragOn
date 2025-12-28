import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-solid'],
  srcDir: 'src',
  outDir: 'dist',
  publicDir: 'static',
});
