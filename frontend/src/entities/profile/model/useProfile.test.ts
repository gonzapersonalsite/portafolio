import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'

vi.mock('@/entities/profile/api/profileApi', () => ({
  getProfile: vi.fn(),
}))

vi.mock('@/shared/lib/requestCache', () => ({
  requestCache: { get: vi.fn().mockReturnValue(null) },
}))

vi.mock('@/shared/config', () => ({
  i18n: { language: 'en' },
}))

import { useProfile } from './useProfile'
import { getProfile } from '@/entities/profile/api/profileApi'
import { requestCache } from '@/shared/lib/requestCache'

const mockProfile = {
  id: '1', fullNameEn: 'John', fullNameEs: 'Juan', email: 'j@b.com',
  greetingEn: '', greetingEs: '', titleEn: '', titleEs: '', subtitleEn: '', subtitleEs: '',
  descriptionEn: '', descriptionEs: '', aboutTitleEn: '', aboutTitleEs: '', aboutIntroTitleEn: '',
  aboutIntroTitleEs: '', aboutSummaryEn: '', aboutSummaryEs: '', aboutPhilosophyEn: '',
  aboutPhilosophyEs: '', sentenceEn: '', sentenceEs: '', cvUrl: '', githubUrl: '',
  linkedinUrl: '', locationEn: '', locationEs: '', logoText: '', imageUrl: '',
}

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(requestCache.get).mockReturnValue(null)
  })

  it('returns profile after successful fetch', async () => {
    vi.mocked(getProfile).mockResolvedValue(mockProfile)
    const { result } = renderHook(() => useProfile())
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.profile).toEqual(mockProfile)
    expect(result.current.error).toBeNull()
  })

  it('returns cached profile immediately', () => {
    vi.mocked(requestCache.get).mockReturnValue(mockProfile)
    const { result } = renderHook(() => useProfile())
    expect(result.current.loading).toBe(false)
    expect(result.current.profile).toEqual(mockProfile)
  })

  it('sets error on fetch failure', async () => {
    vi.mocked(getProfile).mockRejectedValue(new Error('fail'))
    const { result } = renderHook(() => useProfile())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Failed to load profile')
  })

  it('refetch updates state', async () => {
    vi.mocked(getProfile).mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce(mockProfile)
    const { result } = renderHook(() => useProfile())
    await waitFor(() => expect(result.current.error).toBeTruthy())
    await act(async () => { await result.current.refetch() })
    expect(result.current.profile).toEqual(mockProfile)
  })
})
