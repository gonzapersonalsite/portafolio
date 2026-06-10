import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

import apiClient from './apiClient'
import { adminService } from './adminService'

describe('adminService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Skills', () => {
    it('getSkills calls apiClient.get', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
      await adminService.getSkills()
      expect(apiClient.get).toHaveBeenCalledWith('/admin/skills')
    })

    it('createSkill calls apiClient.post', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: { id: '1' } })
      await adminService.createSkill({ nameEn: 'React', nameEs: 'React', level: 80, category: 'Frontend', order: 1 })
      expect(apiClient.post).toHaveBeenCalledWith('/admin/skills', expect.any(Object))
    })

    it('updateSkill calls apiClient.put', async () => {
      vi.mocked(apiClient.put).mockResolvedValue({ data: {} })
      await adminService.updateSkill('123', { level: 90 })
      expect(apiClient.put).toHaveBeenCalledWith('/admin/skills/123', { level: 90 })
    })

    it('deleteSkill calls apiClient.delete', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({})
      await adminService.deleteSkill('123')
      expect(apiClient.delete).toHaveBeenCalledWith('/admin/skills/123')
    })
  })

  describe('Experiences', () => {
    it('CRUD operations call correct endpoints', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
      vi.mocked(apiClient.post).mockResolvedValue({ data: {} })
      vi.mocked(apiClient.put).mockResolvedValue({ data: {} })
      vi.mocked(apiClient.delete).mockResolvedValue({})

      await adminService.getExperiences()
      expect(apiClient.get).toHaveBeenCalledWith('/admin/experiences')

      await adminService.deleteExperience('456')
      expect(apiClient.delete).toHaveBeenCalledWith('/admin/experiences/456')
    })
  })

  describe('Projects', () => {
    it('CRUD operations call correct endpoints', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
      vi.mocked(apiClient.post).mockResolvedValue({ data: {} })

      await adminService.getProjects()
      expect(apiClient.get).toHaveBeenCalledWith('/admin/projects')

      await adminService.createProject({
        titleEn: 'P', titleEs: 'P', descriptionEn: '', descriptionEs: '',
        type: 'web', technologies: [], imageUrls: [],
        githubUrl: '', liveUrl: '', featured: false, order: 0,
      })
      expect(apiClient.post).toHaveBeenCalledWith('/admin/projects', expect.any(Object))
    })
  })

  describe('Profile', () => {
    it('getProfile and updateProfile call correct endpoints', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: {} })
      vi.mocked(apiClient.put).mockResolvedValue({ data: {} })

      await adminService.getProfile()
      expect(apiClient.get).toHaveBeenCalledWith('/admin/profile')

      await adminService.updateProfile({ fullNameEn: 'New Name' })
      expect(apiClient.put).toHaveBeenCalledWith('/admin/profile', { fullNameEn: 'New Name' })
    })
  })

  describe('SpokenLanguages', () => {
    it('CRUD operations call correct endpoints', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
      vi.mocked(apiClient.delete).mockResolvedValue({})

      await adminService.getSpokenLanguages()
      expect(apiClient.get).toHaveBeenCalledWith('/admin/spoken-languages')

      await adminService.deleteSpokenLanguage('789')
      expect(apiClient.delete).toHaveBeenCalledWith('/admin/spoken-languages/789')
    })
  })
})
