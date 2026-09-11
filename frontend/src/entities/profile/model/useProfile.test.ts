import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useProfile } from './useProfile'

describe('useProfile', () => {
    it('returns the static profile synchronously', () => {
        const { result } = renderHook(() => useProfile())
        expect(result.current.profile).toBeTruthy()
        expect(result.current.profile.id).toBe('profile')
        expect(result.current.profile.email).toBeTruthy()
    })
})
