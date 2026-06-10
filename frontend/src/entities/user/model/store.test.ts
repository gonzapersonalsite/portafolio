import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/entities/user/api/authApi', () => ({
  authApi: {
    validateToken: vi.fn(),
  },
}))

import { useAuthStore } from './store'
import { authApi } from '@/entities/user/api/authApi'

const resetStore = () => {
  useAuthStore.setState({ token: null, username: null, isAuthenticated: false })
}

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    resetStore()
  })

  describe('login', () => {
    it('sets token, username, and isAuthenticated', () => {
      useAuthStore.getState().login({ token: 'jwt-123', username: 'admin', expiresAt: '' })
      const state = useAuthStore.getState()
      expect(state.token).toBe('jwt-123')
      expect(state.username).toBe('admin')
      expect(state.isAuthenticated).toBe(true)
    })
  })

  describe('logout', () => {
    it('clears token, username, and isAuthenticated', () => {
      useAuthStore.getState().login({ token: 'jwt', username: 'admin', expiresAt: '' })
      useAuthStore.getState().logout()
      const state = useAuthStore.getState()
      expect(state.token).toBeNull()
      expect(state.username).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('validateToken', () => {
    it('returns true when token is valid', async () => {
      useAuthStore.setState({ token: 'valid', isAuthenticated: true })
      vi.mocked(authApi.validateToken).mockResolvedValue(true)
      const isValid = await useAuthStore.getState().validateToken()
      expect(isValid).toBe(true)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })

    it('returns false and logs out when token is invalid', async () => {
      useAuthStore.getState().login({ token: 'bad', username: 'admin', expiresAt: '' })
      vi.mocked(authApi.validateToken).mockResolvedValue(false)
      const isValid = await useAuthStore.getState().validateToken()
      expect(isValid).toBe(false)
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })

    it('returns false when no token exists', async () => {
      const isValid = await useAuthStore.getState().validateToken()
      expect(isValid).toBe(false)
    })

    it('returns false and logs out on network error', async () => {
      useAuthStore.getState().login({ token: 'token', username: 'admin', expiresAt: '' })
      vi.mocked(authApi.validateToken).mockRejectedValue(new Error('Network error'))
      const isValid = await useAuthStore.getState().validateToken()
      expect(isValid).toBe(false)
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })
})
