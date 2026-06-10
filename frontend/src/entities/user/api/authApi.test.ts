import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/shared/api', () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}))

import { apiClient } from '@/shared/api'
import { authApi } from './authApi'

describe('authApi', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('login calls POST /auth/login', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { token: 'jwt', username: 'admin', expiresAt: '' } })
    const result = await authApi.login({ username: 'admin', password: 'pass' })
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', { username: 'admin', password: 'pass' })
    expect(result).toEqual({ token: 'jwt', username: 'admin', expiresAt: '' })
  })

  it('validateToken calls GET /auth/validate', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: true })
    const result = await authApi.validateToken()
    expect(apiClient.get).toHaveBeenCalledWith('/auth/validate')
    expect(result).toBe(true)
  })

  it('forgotPassword calls POST /auth/forgot-password', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { message: 'Email sent' } })
    const result = await authApi.forgotPassword({ username: 'admin' })
    expect(apiClient.post).toHaveBeenCalledWith('/auth/forgot-password', { username: 'admin' })
    expect(result).toEqual({ message: 'Email sent' })
  })

  it('resetPassword calls POST /auth/reset-password', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { message: 'Password reset' } })
    const result = await authApi.resetPassword({ token: 'abc', newPassword: 'new' })
    expect(apiClient.post).toHaveBeenCalledWith('/auth/reset-password', { token: 'abc', newPassword: 'new' })
    expect(result).toEqual({ message: 'Password reset' })
  })
})
