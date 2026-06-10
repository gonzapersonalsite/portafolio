import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/shared/api', () => ({
  apiClient: { get: vi.fn(), put: vi.fn() },
}))

import { apiClient } from '@/shared/api'
import { getProfile, updateProfile } from './profileApi'

describe('profileApi', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('getProfile calls GET /public/profile', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: {} })
    await getProfile()
    expect(apiClient.get).toHaveBeenCalledWith('/public/profile')
  })

  it('updateProfile calls PUT /admin/profile', async () => {
    vi.mocked(apiClient.put).mockResolvedValue({ data: {} })
    await updateProfile({ fullNameEn: 'New' })
    expect(apiClient.put).toHaveBeenCalledWith('/admin/profile', { fullNameEn: 'New' })
  })
})
