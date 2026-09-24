import { afterEach, describe, expect, it, vi } from 'vitest'
import { readStorage, writeStorage } from './storage'

const blockStorage = () =>
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('Access is denied for this document.', 'SecurityError')
  })

describe('storage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  it('reads back what it wrote', () => {
    expect(writeStorage('preference', 'dark')).toBe(true)
    expect(readStorage('preference')).toBe('dark')
    expect(readStorage('missing')).toBeNull()
  })

  it('degrades to "nothing saved" when the browser blocks site data', () => {
    blockStorage()

    expect(readStorage('preference')).toBeNull()
    expect(writeStorage('preference', 'dark')).toBe(false)
  })
})
