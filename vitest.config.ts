import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    root: resolve(__dirname, 'src')
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
