import React from 'react'

// @mui/material exports
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => children
export const CssBaseline = () => null
export const Snackbar = () => null
export const Alert = () => null
export const useTheme = () => ({
  zIndex: { snackbar: 1300 },
  shadows: ['', '', '', '0px 3px 5px -1px rgba(0,0,0,0.2)'],
  shape: { borderRadius: 8 },
})

// @mui/material/styles exports
export const createTheme = (options: Record<string, unknown> = {}) => ({
  palette: { mode: 'light', ...((options as Record<string, unknown>)?.palette as Record<string, unknown> || {}) },
  typography: (options as Record<string, unknown>)?.typography as Record<string, unknown> ?? {},
  components: (options as Record<string, unknown>)?.components as Record<string, unknown> ?? {},
  shape: (options as Record<string, unknown>)?.shape as Record<string, unknown> ?? {},
})

// @mui/icons-material default export — all icons are empty components
const MockIcon = () => null
export default MockIcon
