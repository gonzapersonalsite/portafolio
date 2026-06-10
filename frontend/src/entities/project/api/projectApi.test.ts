import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/shared/api', () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

import { apiClient } from '@/shared/api'
import { getAllProjects, getFeaturedProjects, getProjects, deleteProject } from './projectApi'

describe('projectApi', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('getAllProjects calls GET /public/projects', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
    await getAllProjects()
    expect(apiClient.get).toHaveBeenCalledWith('/public/projects')
  })

  it('getFeaturedProjects calls GET /public/projects/featured', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
    await getFeaturedProjects()
    expect(apiClient.get).toHaveBeenCalledWith('/public/projects/featured')
  })

  it('getProjects calls GET /admin/projects', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
    await getProjects()
    expect(apiClient.get).toHaveBeenCalledWith('/admin/projects')
  })

  it('deleteProject calls DELETE /admin/projects/:id', async () => {
    await deleteProject('1')
    expect(apiClient.delete).toHaveBeenCalledWith('/admin/projects/1')
  })
})
