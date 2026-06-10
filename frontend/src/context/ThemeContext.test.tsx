import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { useColorMode } from './ThemeContext'

vi.mock('@mui/material', () => ({
  createTheme: vi.fn((options: Record<string, unknown>) => options),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  CssBaseline: () => null,
}))

vi.mock('@mui/material/styles', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('../config/theme', () => ({
  default: vi.fn((mode: string) => ({ palette: { mode: mode === 'glass' ? 'dark' : mode } })),
}))

import { ThemeProvider } from './ThemeContext'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-color-scheme: light)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('useColorMode', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('defaults to light when system prefers light', () => {
    const { result } = renderHook(() => useColorMode(), { wrapper })
    expect(result.current.mode).toBe('light')
  })

  it('toggles through light -> dark -> glass -> light', () => {
    const { result } = renderHook(() => useColorMode(), { wrapper })
    expect(result.current.mode).toBe('light')
    act(() => result.current.toggleColorMode())
    expect(result.current.mode).toBe('dark')
    act(() => result.current.toggleColorMode())
    expect(result.current.mode).toBe('glass')
    act(() => result.current.toggleColorMode())
    expect(result.current.mode).toBe('light')
  })

  it('sets a specific mode when passed to toggleColorMode', () => {
    const { result } = renderHook(() => useColorMode(), { wrapper })
    act(() => result.current.toggleColorMode('glass'))
    expect(result.current.mode).toBe('glass')
  })

  it('persists mode to localStorage', () => {
    const { result } = renderHook(() => useColorMode(), { wrapper })
    act(() => result.current.toggleColorMode('dark'))
    expect(localStorageMock.setItem).toHaveBeenCalledWith('themeMode', 'dark')
  })

  it('reads initial mode from localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce('dark')
    const { result } = renderHook(() => useColorMode(), { wrapper })
    expect(result.current.mode).toBe('dark')
  })
})
