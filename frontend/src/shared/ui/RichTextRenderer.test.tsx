import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import RichTextRenderer from './RichTextRenderer'

describe('RichTextRenderer', () => {
  it('renders each line as a paragraph and consecutive bullets as one list', () => {
    render(<RichTextRenderer text={'Tasks:\\n● First ● Second\\nDone'} />)

    expect(screen.getAllByRole('list')).toHaveLength(1)
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['First', 'Second'])
    expect(screen.getByText('Tasks:').tagName).toBe('P')
    expect(screen.getByText('Done').tagName).toBe('P')
  })

  it('keeps a hyphen inside a sentence as text', () => {
    render(<RichTextRenderer text="Frontend - React" />)

    expect(screen.queryByRole('list')).toBeNull()
    expect(screen.getByText('Frontend - React')).toBeTruthy()
  })
})
