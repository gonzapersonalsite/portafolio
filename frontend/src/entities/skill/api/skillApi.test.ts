import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/shared/api', () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

import { apiClient } from '@/shared/api'
import { getAllSkills, getSkills, createSkill, updateSkill, deleteSkill } from './skillApi'

describe('skillApi', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('getAllSkills calls GET /public/skills', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
    await getAllSkills()
    expect(apiClient.get).toHaveBeenCalledWith('/public/skills')
  })

  it('getSkills calls GET /admin/skills', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
    await getSkills()
    expect(apiClient.get).toHaveBeenCalledWith('/admin/skills')
  })

  it('createSkill calls POST /admin/skills', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: {} })
    await createSkill({ nameEn: 'R', nameEs: 'R', level: 80, category: 'Frontend', order: 1 })
    expect(apiClient.post).toHaveBeenCalledWith('/admin/skills', expect.any(Object))
  })

  it('updateSkill calls PUT /admin/skills/:id', async () => {
    vi.mocked(apiClient.put).mockResolvedValue({ data: {} })
    await updateSkill('123', { level: 90 })
    expect(apiClient.put).toHaveBeenCalledWith('/admin/skills/123', { level: 90 })
  })

  it('deleteSkill calls DELETE /admin/skills/:id', async () => {
    await deleteSkill('123')
    expect(apiClient.delete).toHaveBeenCalledWith('/admin/skills/123')
  })
})
