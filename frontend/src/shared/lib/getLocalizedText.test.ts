import { describe, it, expect } from 'vitest'
import { getLocalizedText } from './getLocalizedText'

describe('getLocalizedText', () => {
  it('returns the English text for en', () => {
    expect(getLocalizedText('en', 'Hello', 'Hola')).toBe('Hello')
  })

  it('returns the Spanish text for es', () => {
    expect(getLocalizedText('es', 'Hello', 'Hola')).toBe('Hola')
  })

  it('falls back to the other language when the selected one is missing', () => {
    expect(getLocalizedText('en', undefined, 'Hola')).toBe('Hola')
    expect(getLocalizedText('es', 'Hello', undefined)).toBe('Hello')
  })

  it('returns an empty string when both texts are missing', () => {
    expect(getLocalizedText('en', undefined, undefined)).toBe('')
  })
})
