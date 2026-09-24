import { describe, it, expect } from 'vitest'
import { normalizeRichText, parseBulletLine } from './richText'

describe('normalizeRichText', () => {
  it('turns literal backslash-n sequences into line breaks', () => {
    expect(normalizeRichText('First line\\nSecond line')).toBe('First line\nSecond line')
    expect(normalizeRichText('One\\n\\nTwo')).toBe('One\n\nTwo')
  })

  it('leaves real line breaks untouched', () => {
    expect(normalizeRichText('First line\nSecond line')).toBe('First line\nSecond line')
  })

  it('moves a bullet glyph that follows text to its own line', () => {
    expect(normalizeRichText('Tasks: ● First ● Second')).toBe('Tasks:\n● First\n● Second')
  })

  it('leaves hyphens and asterisks inside a sentence alone', () => {
    expect(normalizeRichText('Frontend - React, 5 * 3 tests')).toBe('Frontend - React, 5 * 3 tests')
  })
})

describe('parseBulletLine', () => {
  it('returns the text of a line that starts with a bullet marker', () => {
    expect(parseBulletLine('● First')).toBe('First')
    expect(parseBulletLine('  - Second')).toBe('Second')
    expect(parseBulletLine('*Third')).toBe('Third')
  })

  it('returns null for a paragraph line', () => {
    expect(parseBulletLine('Frontend - React')).toBeNull()
    expect(parseBulletLine('')).toBeNull()
  })
})
