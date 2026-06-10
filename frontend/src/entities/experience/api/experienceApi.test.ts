import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/shared/api', () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

import { apiClient } from '@/shared/api'
import { getAllExperiences, getExperiences, deleteExperience } from './experienceApi'

describe('experienceApi', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('getAllExperiences calls GET /public/experiences', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
    await getAllExperiences()
    expect(apiClient.get).toHaveBeenCalledWith('/public/experiences')
  })

  it('getExperiences calls GET /admin/experiences', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
    await getExperiences()
    expect(apiClient.get).toHaveBeenCalledWith('/admin/experiences')
  })

  it('deleteExperience calls DELETE /admin/experiences/:id', async () => {
    await deleteExperience('456')
    expect(apiClient.delete).toHaveBeenCalledWith('/admin/experiences/456')
  })
})
