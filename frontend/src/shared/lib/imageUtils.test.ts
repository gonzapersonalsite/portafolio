import { describe, it, expect } from 'vitest'
import { formatImageUrl } from './imageUtils'

describe('formatImageUrl', () => {
  it('returns undefined for falsy input', () => {
    expect(formatImageUrl(undefined)).toBeUndefined()
    expect(formatImageUrl('')).toBeUndefined()
  })

  it('returns non-Google-Drive URLs unchanged', () => {
    expect(formatImageUrl('https://i.postimg.cc/abc.jpg')).toBe('https://i.postimg.cc/abc.jpg')
  })

  it('converts Google Drive /d/ links to thumbnail format', () => {
    expect(formatImageUrl('https://drive.google.com/file/d/ABCDEF123/view')).toBe('https://drive.google.com/thumbnail?id=ABCDEF123&sz=w1000')
  })

  it('converts Google Drive ?id= links to thumbnail format', () => {
    expect(formatImageUrl('https://drive.google.com/uc?export=download&id=XYZ789')).toBe('https://drive.google.com/thumbnail?id=XYZ789&sz=w1000')
  })

  it('returns original URL if Google Drive link has no recognizable file ID', () => {
    expect(formatImageUrl('https://drive.google.com/some/unknown/path')).toBe('https://drive.google.com/some/unknown/path')
  })
})
