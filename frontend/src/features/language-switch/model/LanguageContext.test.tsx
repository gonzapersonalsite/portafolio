import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { useLanguage, LanguageProvider } from '@/features/language-switch'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key: string) => key),
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}))

const store: Record<string, string> = {}
Object.defineProperty(globalThis, 'localStorage', { value: {
  getItem: vi.fn((k: string) => store[k] ?? null),
  setItem: vi.fn((k: string, v: string) => { store[k] = v }),
  clear: vi.fn(() => { for (const k of Object.keys(store)) delete store[k] }),
}})

const wrapper = ({ children }: { children: React.ReactNode }) => <LanguageProvider>{children}</LanguageProvider>

describe('useLanguage', () => {
  beforeEach(() => { vi.clearAllMocks(); for (const k of Object.keys(store)) delete store[k] })

  it('returns current language', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    expect(result.current.language).toBe('en')
  })

  it('toggleLanguage switches between en and es', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    act(() => result.current.toggleLanguage())
    expect(result.current.language).toBe('es')
    act(() => result.current.toggleLanguage())
    expect(result.current.language).toBe('en')
  })

  it('setLanguage changes to specified language', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    act(() => result.current.setLanguage('es'))
    expect(result.current.language).toBe('es')
  })

  it('throws when used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useLanguage())).toThrow('useLanguage must be used within a LanguageProvider')
    spy.mockRestore()
  })
})
