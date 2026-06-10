import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/shared/api', () => ({
  apiClient: { get: vi.fn(), delete: vi.fn() },
}))

import { apiClient } from '@/shared/api'
import { getAllSpokenLanguages, getSpokenLanguages, deleteSpokenLanguage } from './languageApi'

describe('languageApi', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('getAllSpokenLanguages calls GET /public/spoken-languages', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
    await getAllSpokenLanguages()
    expect(apiClient.get).toHaveBeenCalledWith('/public/spoken-languages')
  })

  it('getSpokenLanguages calls GET /admin/spoken-languages', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
    await getSpokenLanguages()
    expect(apiClient.get).toHaveBeenCalledWith('/admin/spoken-languages')
  })

  it('deleteSpokenLanguage calls DELETE /admin/spoken-languages/:id', async () => {
    await deleteSpokenLanguage('1')
    expect(apiClient.delete).toHaveBeenCalledWith('/admin/spoken-languages/1')
  })
})
