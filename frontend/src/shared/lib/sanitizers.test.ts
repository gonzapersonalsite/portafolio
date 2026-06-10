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
    expect(parseUrlStringToArray(input)).toEqual(['https://example.com/image1.jpg', 'https://example.com/image2.jpg'])
  })

  it('trims whitespace and removes backticks and quotes', () => {
    const input = '`https://a.com/1.png`\n"https://b.com/2.jpg"\n\'https://c.com/3.gif\''
    expect(parseUrlStringToArray(input)).toEqual(['https://a.com/1.png', 'https://b.com/2.jpg', 'https://c.com/3.gif'])
  })

  it('filters empty lines', () => {
    expect(parseUrlStringToArray('https://a.com\n\n\nhttps://b.com\n   \n')).toEqual(['https://a.com', 'https://b.com'])
  })

  it('handles array input', () => {
    expect(parseUrlStringToArray(['`https://a.com`', ' "https://b.com" ', 'https://c.com'])).toEqual(['https://a.com', 'https://b.com', 'https://c.com'])
  })
})

describe('parseCommaSeparatedString', () => {
  it('returns empty array for falsy inputs', () => {
    expect(parseCommaSeparatedString(null)).toEqual([])
    expect(parseCommaSeparatedString('')).toEqual([])
  })

  it('splits comma-separated string', () => {
    expect(parseCommaSeparatedString('React, TypeScript, Vite')).toEqual(['React', 'TypeScript', 'Vite'])
  })

  it('trims whitespace', () => {
    expect(parseCommaSeparatedString(' React ,  TypeScript , Vite ')).toEqual(['React', 'TypeScript', 'Vite'])
  })

  it('filters empty values', () => {
    expect(parseCommaSeparatedString('React,,TypeScript, ,')).toEqual(['React', 'TypeScript'])
  })
})
