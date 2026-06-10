import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { useNotification, NotificationProvider } from '@/features/notifications'

vi.mock('@mui/material', () => ({
  Snackbar: vi.fn(() => null),
  Alert: vi.fn(() => null),
  useTheme: () => ({ zIndex: { snackbar: 1300 }, shadows: ['', '', '', '0px'], shape: { borderRadius: 8 } }),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: vi.fn((k: string) => k) }),
}))

vi.mock('@/shared/lib/notificationEvents', () => ({
  notificationEvents: { subscribe: vi.fn(() => vi.fn()) },
}))

const wrapper = ({ children }: { children: React.ReactNode }) => <NotificationProvider>{children}</NotificationProvider>

describe('useNotification', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns showNotification function', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })
    expect(typeof result.current.showNotification).toBe('function')
  })

  it('showNotification can be called', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })
    expect(() => act(() => { result.current.showNotification('Test', 'success', 5000) })).not.toThrow()
  })

  it('throws when used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useNotification())).toThrow('useNotification must be used within a NotificationProvider')
    spy.mockRestore()
  })
})
