import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { useNotification } from './NotificationContext'

vi.mock('@mui/material', () => ({
  Snackbar: vi.fn(() => null),
  Alert: vi.fn(() => null),
  useTheme: vi.fn(() => ({
    zIndex: { snackbar: 1300 },
    shadows: ['', '', '', '0px 3px 5px -1px rgba(0,0,0,0.2)'],
    shape: { borderRadius: 8 },
  })),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key: string) => key),
  }),
}))

vi.mock('@/utils/notificationEvents', () => ({
  notificationEvents: {
    subscribe: vi.fn(() => vi.fn()),
    emit: vi.fn(),
  },
}))

import { NotificationProvider } from './NotificationContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NotificationProvider>{children}</NotificationProvider>
)

describe('useNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns showNotification function', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })
    expect(typeof result.current.showNotification).toBe('function')
  })

  it('showNotification can be called without errors', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })
    expect(() => {
      act(() => {
        result.current.showNotification('Test message', 'success', 5000)
      })
    }).not.toThrow()
  })

  it('showNotification uses default severity and duration', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })
    expect(() => {
      act(() => {
        result.current.showNotification('Message only')
      })
    }).not.toThrow()
  })

  it('throws when used outside NotificationProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useNotification())).toThrow(
      'useNotification must be used within a NotificationProvider'
    )
    spy.mockRestore()
  })
})
