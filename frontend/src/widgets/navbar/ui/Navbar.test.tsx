import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Navbar } from '@/widgets/navbar'
import { LanguageProvider } from '@/features/language-switch'
import { ThemeProvider } from '@/features/theme-switch'
import { i18n } from '@/shared/config'

const renderNavbar = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    </MemoryRouter>,
  )

describe('Navbar', () => {
  beforeEach(async () => {
    window.localStorage.clear()
    await i18n.changeLanguage('en')
  })

  it('puts the page links in a named navigation landmark and marks the current page', () => {
    renderNavbar('/skills')

    const nav = within(screen.getByRole('banner')).getByRole('navigation', { name: 'Main navigation' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual(['Home', 'About', 'Skills', 'Experience', 'Projects', 'Contact'])
    expect(links.filter((link) => link.getAttribute('aria-current') === 'page').map((link) => link.textContent)).toEqual(['Skills'])
  })

  it('opens the mobile menu as a named dialog with the brand and the current page', () => {
    renderNavbar('/projects')
    const menuButton = screen.getByRole('button', { name: 'Open menu' })
    expect(menuButton.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(menuButton)

    expect(menuButton.getAttribute('aria-expanded')).toBe('true')
    const drawer = screen.getByRole('dialog', { name: 'Menu' })
    expect(menuButton.getAttribute('aria-controls')).toBe(drawer.id)
    expect(drawer.querySelector('p')?.textContent).toBe('GONZALO.DEV')
    const current = within(within(drawer).getByRole('navigation')).getByRole('link', { current: 'page' })
    expect(current.textContent).toBe('Projects')
  })
})
