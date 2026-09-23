import { describe, it, expect } from 'vitest'
import { normalizeRichText } from './richText'

describe('normalizeRichText', () => {
  it('turns literal backslash-n sequences into line breaks', () => {
    expect(normalizeRichText('First line\\nSecond line')).toBe('First line\nSecond line')
    expect(normalizeRichText('One\\n\\nTwo')).toBe('One\n\nTwo')
  })

  it('leaves real line breaks untouched', () => {
    expect(normalizeRichText('First line\nSecond line')).toBe('First line\nSecond line')
  })

  it('moves a bullet marker that follows text to its own line', () => {
    expect(normalizeRichText('Tasks: ● First ● Second')).toBe('Tasks:\n● First\n● Second')
  })
})
