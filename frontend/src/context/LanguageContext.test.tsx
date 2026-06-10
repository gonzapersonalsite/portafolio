import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { useLanguage, LanguageProvider, type Language } from './LanguageContext'

const mockI18n = {
  language: 'en',
  changeLanguage: vi.fn(),
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key: string) => key),
    i18n: mockI18n,
  }),
}))

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    clear: vi.fn(() => { store = {} }),
  }
})()
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
)

describe('useLanguage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    mockI18n.language = 'en'
  })

  it('returns the current language from i18n', () => {
    mockI18n.language = 'en'
    const { result } = renderHook(() => useLanguage(), { wrapper })
    expect(result.current.language).toBe('en')
  })

  it('toggleLanguage switches between en and es', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })

    expect(result.current.language).toBe('en')

    act(() => result.current.toggleLanguage())
    expect(result.current.language).toBe('es')

    act(() => result.current.toggleLanguage())
    expect(result.current.language).toBe('en')
  })

  it('setLanguage changes to the specified language', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })

    act(() => result.current.setLanguage('es'))
    expect(result.current.language).toBe('es')
    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('es')

    act(() => result.current.setLanguage('en'))
    expect(result.current.language).toBe('en')
  })

  it('persists language to localStorage', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })

    act(() => result.current.setLanguage('es'))
    expect(localStorageMock.setItem).toHaveBeenCalledWith('language', 'es')
  })

  it('throws when used outside LanguageProvider', () => {
    // Suppress console.error for expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useLanguage())).toThrow('useLanguage must be used within a LanguageProvider')
    spy.mockRestore()
  })

  it('falls back to localStorage language when i18n language is unsupported', () => {
    mockI18n.language = 'fr' // unsupported
    localStorageMock.getItem.mockReturnValue('es')

    const { result } = renderHook(() => useLanguage(), { wrapper })
    expect(result.current.language).toBe('es')
  })
})
