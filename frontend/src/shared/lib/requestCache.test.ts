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

describe('requestCache', () => {
  beforeEach(() => {
    for (const k of Object.keys(_store)) delete _store[k]
    for (const k of Object.keys(localStorageMock)) { if (k !== 'getItem' && k !== 'setItem' && k !== 'removeItem' && k !== 'clear' && k !== 'length' && k !== 'key') delete localStorageMock[k] }
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('returns null for a non-existent key', () => {
      expect(requestCache.get('missing')).toBeNull()
    })

    it('returns cached data for a valid non-expired key', () => {
      requestCache.set('user', { name: 'test' })
      expect(requestCache.get('user')).toEqual({ name: 'test' })
    })

    it('returns null and removes expired entries', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)
      requestCache.set('old', { value: 1 })
      vi.spyOn(Date, 'now').mockReturnValue(now + 25 * 60 * 60 * 1000)
      expect(requestCache.get('old')).toBeNull()
    })

    it('returns null for corrupted cache entries', () => {
      _store['api_cache_bad'] = '{invalid json'
      expect(requestCache.get('bad')).toBeNull()
    })

    it('handles different data types', () => {
      requestCache.set('str', 'hello')
      requestCache.set('num', 42)
      requestCache.set('arr', [1, 2, 3])
      expect(requestCache.get('str')).toBe('hello')
      expect(requestCache.get('num')).toBe(42)
      expect(requestCache.get('arr')).toEqual([1, 2, 3])
    })
  })

  describe('set', () => {
    it('stores data with timestamp', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)
      requestCache.set('key', { value: 'data' })
      const raw = _store['api_cache_key']
      expect(raw).toBeTruthy()
      const parsed = JSON.parse(raw!)
      expect(parsed.data).toEqual({ value: 'data' })
      expect(parsed.timestamp).toBe(now)
    })
  })

  describe('clear', () => {
    it('removes all cache entries with the api_cache_ prefix', () => {
      requestCache.set('a', 1)
      requestCache.set('b', 2)
      _store['other'] = 'should remain'
      requestCache.clear()
      expect(requestCache.get('a')).toBeNull()
      expect(requestCache.get('b')).toBeNull()
      expect(_store['other']).toBe('should remain')
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
      requestCache.set('fresh', 1)
      vi.spyOn(Date, 'now').mockReturnValue(now + 25 * 60 * 60 * 1000)
      requestCache.set('newer', 2)
      vi.spyOn(Date, 'now').mockReturnValue(now + 25 * 60 * 60 * 1000 + 1000)
      requestCache.prune()
      expect(requestCache.get('fresh')).toBeNull()
      expect(requestCache.get('newer')).toBe(2)
    })

    it('removes corrupted entries during prune', () => {
      _store['api_cache_corrupt'] = '{broken'
      requestCache.prune()
      expect(requestCache.get('corrupt')).toBeNull()
    })
  })
})
