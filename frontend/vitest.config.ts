import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@mui/material': path.resolve(__dirname, './src/__tests__/__mocks__/mui.ts'),
      '@mui/material/styles': path.resolve(__dirname, './src/__tests__/__mocks__/mui.ts'),
      '@mui/icons-material': path.resolve(__dirname, './src/__tests__/__mocks__/mui.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
