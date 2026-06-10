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
export const createTheme = (options: Record<string, unknown>) => ({
  ...options,
  palette: { mode: options?.palette?.mode ?? 'light', ...options?.palette },
  typography: options?.typography ?? {},
  components: options?.components ?? {},
  shape: options?.shape ?? {},
})
