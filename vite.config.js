import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { plugin as mdPlugin } from 'vite-plugin-markdown'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // mdPlugin({
    //   mode: 'html'
    // }),
    svgLoader()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // '/assets': fileURLToPath(new URL('./public/assets', import.meta.url))
    }
  },
  build: {
    minify: true,
    rollupOptions: {
      // treeshake: {
      //   preset: 'recommended',
      //   manualPureFunctions: ['notices', 'switch']
      // }
    }
  }
})
