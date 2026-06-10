import { describe, it, expect } from 'vitest'
import { formatImageUrl } from './imageUtils'

describe('formatImageUrl', () => {
  it('returns undefined for falsy input', () => {
    expect(formatImageUrl(undefined)).toBeUndefined()
    expect(formatImageUrl('')).toBeUndefined()
  })

  it('returns non-Google-Drive URLs unchanged', () => {
    expect(formatImageUrl('https://i.postimg.cc/abc.jpg')).toBe('https://i.postimg.cc/abc.jpg')
    expect(formatImageUrl('https://example.com/image.png')).toBe('https://example.com/image.png')
  })

  it('converts Google Drive /d/ links to thumbnail format', () => {
    const input = 'https://drive.google.com/file/d/1Xm8xf5GpKLoDaZqA9jBE9CDXNHLJrGtG/view'
    expect(formatImageUrl(input)).toBe(
      'https://drive.google.com/thumbnail?id=1Xm8xf5GpKLoDaZqA9jBE9CDXNHLJrGtG&sz=w1000'
    )
  })

  it('converts Google Drive ?id= links to thumbnail format', () => {
    const input = 'https://drive.google.com/uc?export=download&id=AbCd1234XyZ'
    expect(formatImageUrl(input)).toBe(
      'https://drive.google.com/thumbnail?id=AbCd1234XyZ&sz=w1000'
    )
  })

  it('returns original URL if Google Drive link has no recognizable file ID', () => {
    const input = 'https://drive.google.com/some/unknown/path'
    expect(formatImageUrl(input)).toBe(input)
  })

  it('prioritizes /d/ pattern over ?id= pattern', () => {
    const input = 'https://drive.google.com/file/d/PRIORITY/view?id=IGNORED'
    expect(formatImageUrl(input)).toBe(
      'https://drive.google.com/thumbnail?id=PRIORITY&sz=w1000'
    )
  })
})
