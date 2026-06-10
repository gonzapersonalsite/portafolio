import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'

vi.mock('@/services/publicService', () => ({
  publicService: {
    getProfile: vi.fn(),
  },
}))

vi.mock('@/utils/requestCache', () => ({
  requestCache: {
    get: vi.fn().mockReturnValue(null),
  },
}))

vi.mock('@/config/i18n', () => ({
  default: { language: 'en' },
}))

import { useProfile } from './useProfile'
import { publicService } from '@/services/publicService'
import { requestCache } from '@/utils/requestCache'

const mockProfile = {
  id: '1',
  fullNameEn: 'John Doe',
  fullNameEs: 'Juan Doe',
  email: 'john@example.com',
  greetingEn: 'Hello',
  greetingEs: 'Hola',
  titleEn: 'Dev',
  titleEs: 'Dev',
  subtitleEn: 'Full Stack',
  subtitleEs: 'Full Stack',
  descriptionEn: 'Description',
  descriptionEs: 'Descripción',
  aboutTitleEn: 'About',
  aboutTitleEs: 'Acerca',
  aboutIntroTitleEn: 'Intro',
  aboutIntroTitleEs: 'Intro',
  aboutSummaryEn: 'Summary',
  aboutSummaryEs: 'Resumen',
  aboutPhilosophyEn: 'Philosophy',
  aboutPhilosophyEs: 'Filosofía',
  sentenceEn: 'Quote',
  sentenceEs: 'Cita',
  cvUrl: '',
  githubUrl: '',
  linkedinUrl: '',
  locationEn: '',
  locationEs: '',
  logoText: '',
  imageUrl: '',
}

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(requestCache.get).mockReturnValue(null)
  })

  it('returns profile data after successful fetch', async () => {
    vi.mocked(publicService.getProfile).mockResolvedValue(mockProfile)

    const { result } = renderHook(() => useProfile())

    expect(result.current.loading).toBe(true)
    expect(result.current.profile).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.profile).toEqual(mockProfile)
    expect(result.current.error).toBeNull()
  })

  it('returns cached profile immediately when available', () => {
    vi.mocked(requestCache.get).mockReturnValue(mockProfile)

    const { result } = renderHook(() => useProfile())

    expect(result.current.loading).toBe(false)
    expect(result.current.profile).toEqual(mockProfile)
  })

  it('sets error state on fetch failure', async () => {
    vi.mocked(publicService.getProfile).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useProfile())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to load profile')
    expect(result.current.profile).toBeNull()
  })

  it('refetch re-executes the fetch and updates state', async () => {
    vi.mocked(publicService.getProfile)
      .mockRejectedValueOnce(new Error('First fail'))
      .mockResolvedValueOnce(mockProfile)

    const { result } = renderHook(() => useProfile())

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to load profile')
    })

    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.profile).toEqual(mockProfile)
    expect(result.current.error).toBeNull()
  })
})
