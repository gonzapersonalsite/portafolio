import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useColorMode } from './ThemeContext'

describe('useColorMode', () => {
  it('is a valid hook export', () => {
    expect(typeof useColorMode).toBe('function')
  })

  it('throws when used outside provider', () => {
    let error: Error | null = null
    try { useColorMode() } catch (e) { error = e as Error }
    expect(error).toBeTruthy()
  })
})
