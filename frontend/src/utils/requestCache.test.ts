import { describe, it, expect, beforeEach, vi } from 'vitest'
import { requestCache } from './requestCache'

const _store: Record<string, string> = {}

const localStorageMock: Record<string, unknown> = {}

Object.defineProperties(localStorageMock, {
  getItem: { value: vi.fn((key: string) => _store[key] ?? null), enumerable: false },
  setItem: { value: vi.fn((key: string, value: string) => { _store[key] = value; localStorageMock[key] = value }), enumerable: false },
  removeItem: { value: vi.fn((key: string) => { delete _store[key]; delete localStorageMock[key] }), enumerable: false },
  clear: { value: vi.fn(() => { for (const k of Object.keys(_store)) { delete _store[k]; delete localStorageMock[k] } }), enumerable: false },
  length: { get: () => Object.keys(_store).length, enumerable: false },
  key: { value: vi.fn((index: number) => Object.keys(_store)[index] ?? null), enumerable: false },
})
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

const setLocalItem = (key: string, value: string) => {
  localStorageMock[key] = value
  _store[key] = value
}
const deleteLocalItem = (key: string) => {
  delete localStorageMock[key]
  delete _store[key]
}

describe('requestCache', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('returns null for a non-existent key', () => {
      expect(requestCache.get('missing')).toBeNull()
    })

    it('returns cached data for a valid non-expired key', () => {
      const data = { name: 'test' }
      requestCache.set('user', data)
      expect(requestCache.get('user')).toEqual(data)
    })

    it('returns null and removes expired entries', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)
      requestCache.set('old', { value: 1 })

      vi.spyOn(Date, 'now').mockReturnValue(now + 25 * 60 * 60 * 1000)
      expect(requestCache.get('old')).toBeNull()
    })

    it('returns null for corrupted cache entries', () => {
      localStorageMock.setItem('api_cache_bad', '{invalid json')
      expect(requestCache.get('bad')).toBeNull()
    })

    it('handles different data types', () => {
      requestCache.set('str', 'hello')
      requestCache.set('num', 42)
      requestCache.set('arr', [1, 2, 3])
      requestCache.set('obj', { a: 1 })

      expect(requestCache.get('str')).toBe('hello')
      expect(requestCache.get('num')).toBe(42)
      expect(requestCache.get('arr')).toEqual([1, 2, 3])
      expect(requestCache.get('obj')).toEqual({ a: 1 })
    })
  })

  describe('set', () => {
    it('stores data with timestamp', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)
      requestCache.set('key', { value: 'data' })

      const raw = localStorageMock.getItem('api_cache_key')
      expect(raw).toBeTruthy()
      const parsed = JSON.parse(raw!)
      expect(parsed.data).toEqual({ value: 'data' })
      expect(parsed.timestamp).toBe(now)
    })

    it('handles null data gracefully via JSON', () => {
      requestCache.set('nullable', null)
      expect(requestCache.get('nullable')).toBeNull()
    })
  })

  describe('clear', () => {
    it('removes all cache entries with the api_cache_ prefix', () => {
      requestCache.set('a', 1)
      requestCache.set('b', 2)
      localStorageMock.setItem('other', 'should remain')

      requestCache.clear()

      expect(requestCache.get('a')).toBeNull()
      expect(requestCache.get('b')).toBeNull()
      expect(localStorageMock.getItem('other')).toBe('should remain')
    })
  })

  describe('remove', () => {
    it('removes a specific cache entry', () => {
      requestCache.set('x', 1)
      requestCache.set('y', 2)

      requestCache.remove('x')

      expect(requestCache.get('x')).toBeNull()
      expect(requestCache.get('y')).toBe(2)
    })
  })

  describe('prune', () => {
    it('removes only expired entries', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)

      // Set 'fresh' at current time
      requestCache.set('fresh', 1)

      // Advance time beyond TTL and set 'stale'
      vi.spyOn(Date, 'now').mockReturnValue(now + 25 * 60 * 60 * 1000)
      requestCache.set('newer', 2)

      // At this point: 'fresh' is 25h old (expired), 'newer' is just set (not expired)
      // prune should remove 'fresh' but keep 'newer'
      vi.spyOn(Date, 'now').mockReturnValue(now + 25 * 60 * 60 * 1000 + 1000)
      requestCache.prune()

      expect(requestCache.get('fresh')).toBeNull()
      expect(requestCache.get('newer')).toBe(2)
    })

    it('removes corrupted entries during prune', () => {
      localStorageMock.setItem('api_cache_corrupt', '{broken')
      requestCache.prune()
      expect(requestCache.get('corrupt')).toBeNull()
    })
  })
})
