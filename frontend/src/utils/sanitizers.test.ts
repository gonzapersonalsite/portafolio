import { describe, it, expect } from 'vitest'
import { parseUrlStringToArray, parseCommaSeparatedString } from './sanitizers'

describe('parseUrlStringToArray', () => {
  it('returns empty array for falsy inputs', () => {
    expect(parseUrlStringToArray(null)).toEqual([])
    expect(parseUrlStringToArray(undefined)).toEqual([])
    expect(parseUrlStringToArray('')).toEqual([])
  })

  it('splits multiline string into array', () => {
    const input = 'https://example.com/image1.jpg\nhttps://example.com/image2.jpg'
    expect(parseUrlStringToArray(input)).toEqual([
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ])
  })

  it('trims whitespace and removes backticks and quotes', () => {
    const input = '`https://a.com/1.png`\n"https://b.com/2.jpg"\n\'https://c.com/3.gif\''
    expect(parseUrlStringToArray(input)).toEqual([
      'https://a.com/1.png',
      'https://b.com/2.jpg',
      'https://c.com/3.gif',
    ])
  })

  it('filters empty lines', () => {
    const input = 'https://a.com/1.png\n\n\nhttps://b.com/2.png\n   \n'
    expect(parseUrlStringToArray(input)).toEqual([
      'https://a.com/1.png',
      'https://b.com/2.png',
    ])
  })

  it('handles array input by cleaning each element', () => {
    const input = ['`https://a.com/1.png`', ' "https://b.com/2.jpg" ', 'https://c.com/3.png']
    expect(parseUrlStringToArray(input)).toEqual([
      'https://a.com/1.png',
      'https://b.com/2.jpg',
      'https://c.com/3.png',
    ])
  })

  it('handles array with non-string elements', () => {
    const input = ['  https://a.com  ', 123 as unknown as string]
    expect(parseUrlStringToArray(input)).toEqual([
      'https://a.com',
      '123',
    ])
  })

  it('trims surrounding spaces on each line', () => {
    expect(parseUrlStringToArray('  https://a.com  \n  https://b.com  ')).toEqual([
      'https://a.com',
      'https://b.com',
    ])
  })
})

describe('parseCommaSeparatedString', () => {
  it('returns empty array for falsy inputs', () => {
    expect(parseCommaSeparatedString(null)).toEqual([])
    expect(parseCommaSeparatedString(undefined)).toEqual([])
    expect(parseCommaSeparatedString('')).toEqual([])
  })

  it('splits comma-separated string', () => {
    expect(parseCommaSeparatedString('React, TypeScript, Vite')).toEqual([
      'React',
      'TypeScript',
      'Vite',
    ])
  })

  it('trims whitespace around each value', () => {
    expect(parseCommaSeparatedString(' React ,  TypeScript , Vite ')).toEqual([
      'React',
      'TypeScript',
      'Vite',
    ])
  })

  it('filters empty values', () => {
    expect(parseCommaSeparatedString('React,,TypeScript, ,')).toEqual([
      'React',
      'TypeScript',
    ])
  })

  it('handles array input', () => {
    expect(parseCommaSeparatedString([' React ', ' TypeScript '])).toEqual([
      'React',
      'TypeScript',
    ])
  })

  it('handles array with non-string elements', () => {
    const input = ['React', 123 as unknown as string]
    expect(parseCommaSeparatedString(input)).toEqual(['React', '123'])
  })
})
