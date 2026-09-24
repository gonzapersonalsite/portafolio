import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider, ThemeSelector } from '@/features/theme-switch'
import { i18n } from '@/shared/config'

const renderSelector = () =>
  render(
    <ThemeProvider>
      <ThemeSelector />
    </ThemeProvider>,
  )

describe('ThemeSelector', () => {
  beforeEach(async () => {
    window.localStorage.clear()
    await i18n.changeLanguage('en')
  })

  it('shows the translated theme name and says what the button controls', async () => {
    await i18n.changeLanguage('es')
    renderSelector()

    const button = screen.getByRole('button', { name: 'Tema: Oscuro' })
    expect(button.textContent).toContain('Oscuro')
    expect(button.getAttribute('aria-haspopup')).toBe('menu')
  })

  it('lists the three themes as radio items and applies the chosen one', () => {
    renderSelector()
    fireEvent.click(screen.getByRole('button', { name: 'Theme: Dark' }))

    const menu = screen.getByRole('menu', { name: 'Theme: Dark' })
    expect(within(menu).getAllByRole('menuitemradio').map((item) => item.getAttribute('aria-checked'))).toEqual([
      'false',
      'true',
      'false',
    ])

    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Light' }))

    expect(screen.getByRole('button', { name: 'Theme: Light' })).toBeTruthy()
    expect(window.localStorage.getItem('themeMode')).toBe('light')
  })
})
