import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// @ts-ignore
import path from 'node:path'

// For ESM compatibility in Vite
const __dirname = new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
