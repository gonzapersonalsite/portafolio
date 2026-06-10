import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import apiClient from './apiClient'
import { publicService } from './publicService'

describe('publicService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAllSkills returns data from apiClient', async () => {
    const mockData = [{ id: '1', nameEn: 'React', nameEs: 'React', level: 90, category: 'Frontend', order: 1 }]
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockData })
    const result = await publicService.getAllSkills()
    expect(result).toEqual(mockData)
    expect(apiClient.get).toHaveBeenCalledWith('/public/skills')
  })

  it('getAllExperiences returns data from apiClient', async () => {
    const mockData = [{ id: '1', companyEn: 'ACME', companyEs: 'ACME', positionEn: 'Dev', positionEs: 'Dev', startDate: '2020', endDate: null, descriptionEn: '', descriptionEs: '', technologies: [] }]
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockData })
    const result = await publicService.getAllExperiences()
    expect(result).toEqual(mockData)
    expect(apiClient.get).toHaveBeenCalledWith('/public/experiences')
  })

  it('getAllProjects returns data from apiClient', async () => {
    const mockData = [{ id: '1', titleEn: 'Project', titleEs: 'Proyecto', descriptionEn: '', descriptionEs: '', type: 'web', technologies: [], imageUrls: [], githubUrl: '', liveUrl: '', featured: false, order: 0, createdAt: '' }]
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockData })
    const result = await publicService.getAllProjects()
    expect(result).toEqual(mockData)
    expect(apiClient.get).toHaveBeenCalledWith('/public/projects')
  })

  it('getAllSpokenLanguages returns data from apiClient', async () => {
    const data = [{ id: '1', nameEn: 'Spanish', nameEs: 'Español', levelEn: 'Native', levelEs: 'Nativo', proficiency: 100, order: 1 }]
    vi.mocked(apiClient.get).mockResolvedValue({ data })
    const result = await publicService.getAllSpokenLanguages()
    expect(result).toEqual(data)
    expect(apiClient.get).toHaveBeenCalledWith('/public/spoken-languages')
  })

  it('getProfile returns data from apiClient', async () => {
    const data = { id: '1', fullNameEn: 'John', fullNameEs: 'Juan', email: 'a@b.com' }
    vi.mocked(apiClient.get).mockResolvedValue({ data })
    const result = await publicService.getProfile()
    expect(result).toEqual(data)
    expect(apiClient.get).toHaveBeenCalledWith('/public/profile')
  })

  it('getFeaturedProjects returns data from apiClient', async () => {
    const data = [{ id: '2', titleEn: 'Featured', titleEs: 'Destacado' }]
    vi.mocked(apiClient.get).mockResolvedValue({ data })
    const result = await publicService.getFeaturedProjects()
    expect(result).toEqual(data)
    expect(apiClient.get).toHaveBeenCalledWith('/public/projects/featured')
  })
})
