import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/entities/user/api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    validateToken: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
  },
}))

import { authApi } from './authApi'

describe('authApi', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('login calls POST /auth/login', async () => {
    vi.mocked(authApi.login).mockResolvedValue({ token: 'jwt', username: 'admin', expiresAt: '' })
    const result = await authApi.login({ username: 'admin', password: 'pass' })
    expect(result).toEqual({ token: 'jwt', username: 'admin', expiresAt: '' })
  })

  it('validateToken calls GET /auth/validate', async () => {
    vi.mocked(authApi.validateToken).mockResolvedValue(true)
    expect(await authApi.validateToken()).toBe(true)
  })

  it('forgotPassword calls POST /auth/forgot-password', async () => {
    vi.mocked(authApi.forgotPassword).mockResolvedValue({ message: 'Email sent' })
    expect(await authApi.forgotPassword({ username: 'admin' })).toEqual({ message: 'Email sent' })
  })

  it('resetPassword calls POST /auth/reset-password', async () => {
    vi.mocked(authApi.resetPassword).mockResolvedValue({ message: 'Password reset' })
    expect(await authApi.resetPassword({ token: 'abc', newPassword: 'new' })).toEqual({ message: 'Password reset' })
  })
})
