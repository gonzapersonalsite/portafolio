import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

const mockMuiPath = path.resolve(__dirname, './src/shared/lib/__mocks__/mui.ts')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: /^@mui\/icons-material\/.+$/, replacement: mockMuiPath },
      { find: '@mui/icons-material', replacement: mockMuiPath },
      { find: '@mui/material/styles', replacement: mockMuiPath },
      { find: '@mui/material', replacement: mockMuiPath },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
