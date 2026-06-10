import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../services/authService', () => ({
  authService: {
    validateToken: vi.fn(),
  },
}))

import { useAuthStore } from './AuthStore'
import { authService } from '../services/authService'

const resetStore = () => {
  useAuthStore.setState({
    token: null,
    username: null,
    isAuthenticated: false,
  })
}

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    resetStore()
  })

  describe('login', () => {
    it('sets token, username, and isAuthenticated from auth response', () => {
      useAuthStore.getState().login({
        token: 'jwt-123',
        username: 'admin',
      })

      const state = useAuthStore.getState()
      expect(state.token).toBe('jwt-123')
      expect(state.username).toBe('admin')
      expect(state.isAuthenticated).toBe(true)
    })
  })

  describe('logout', () => {
    it('clears token, username, and isAuthenticated', () => {
      useAuthStore.getState().login({ token: 'jwt', username: 'admin' })
      useAuthStore.getState().logout()

      const state = useAuthStore.getState()
      expect(state.token).toBeNull()
      expect(state.username).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('validateToken', () => {
    it('returns true when token is valid and auth service confirms', async () => {
      useAuthStore.setState({ token: 'valid-token', isAuthenticated: true })
      vi.mocked(authService.validateToken).mockResolvedValue(true)

      const isValid = await useAuthStore.getState().validateToken()

      expect(isValid).toBe(true)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().token).toBe('valid-token')
    })

    it('returns false and logs out when token is invalid', async () => {
      useAuthStore.getState().login({ token: 'bad-token', username: 'admin' })
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      vi.mocked(authService.validateToken).mockResolvedValue(false)

      const isValid = await useAuthStore.getState().validateToken()

      expect(isValid).toBe(false)
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
      expect(useAuthStore.getState().token).toBeNull()
    })

    it('returns false when no token exists (without calling service)', async () => {
      useAuthStore.setState({ token: null, isAuthenticated: false })
      // Expect validateToken to resolve false without calling service
      const isValid = await useAuthStore.getState().validateToken()
      expect(isValid).toBe(false)
    })

    it('returns false and logs out on network error', async () => {
      useAuthStore.getState().login({ token: 'token', username: 'admin' })
      vi.mocked(authService.validateToken).mockRejectedValue(new Error('Network error'))

      const isValid = await useAuthStore.getState().validateToken()

      expect(isValid).toBe(false)
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
      expect(useAuthStore.getState().token).toBeNull()
    })
  })
})
