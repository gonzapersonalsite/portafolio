import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useColorMode } from './ThemeContext'

describe('useColorMode', () => {
  it('is a valid hook export', () => {
    expect(typeof useColorMode).toBe('function')
  })

  it('throws when used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useColorMode())).toThrow('useColorMode must be used within a ThemeProvider')
    spy.mockRestore()
  })
})
