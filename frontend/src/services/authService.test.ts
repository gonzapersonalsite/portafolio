import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import apiClient from './apiClient'
import { authService } from './authService'
import type { LoginCredentials } from './authService'

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('calls apiClient.post with credentials and returns data', async () => {
      const credentials: LoginCredentials = { username: 'admin', password: 'pass123' }
      const mockResponse = { token: 'jwt-token', username: 'admin' }
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse })

      const result = await authService.login(credentials)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('validateToken', () => {
    it('returns boolean from apiClient.get', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: true })
      const result = await authService.validateToken()
      expect(result).toBe(true)
      expect(apiClient.get).toHaveBeenCalledWith('/auth/validate')
    })

    it('returns false when token is invalid', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: false })
      const result = await authService.validateToken()
      expect(result).toBe(false)
    })
  })

  describe('forgotPassword', () => {
    it('calls apiClient.post and returns message', async () => {
      const mockResponse = { message: 'Email sent' }
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse })

      const result = await authService.forgotPassword({ username: 'admin' })

      expect(apiClient.post).toHaveBeenCalledWith('/auth/forgot-password', { username: 'admin' })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('resetPassword', () => {
    it('calls apiClient.post with token and newPassword', async () => {
      const mockResponse = { message: 'Password reset' }
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse })

      const result = await authService.resetPassword({ token: 'abc123', newPassword: 'newpass' })

      expect(apiClient.post).toHaveBeenCalledWith('/auth/reset-password', {
        token: 'abc123',
        newPassword: 'newpass',
      })
      expect(result).toEqual(mockResponse)
    })
  })
})
