import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ChangeEvent, FormEvent } from 'react'
import { useContactForm } from './useContactForm'
import { ContactNotConfiguredError, sendContactMessage } from '../api/contactApi'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('../api/contactApi', () => {
  class ContactNotConfiguredError extends Error {}
  return {
    sendContactMessage: vi.fn(),
    ContactNotConfiguredError,
  }
})

const showNotification = vi.fn()
const mockedSendContactMessage = vi.mocked(sendContactMessage)
const submitEvent = { preventDefault: vi.fn() } as unknown as FormEvent

describe('useContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends the message and notifies success', async () => {
    mockedSendContactMessage.mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useContactForm(showNotification))

    const changeEvent = { target: { name: 'name', value: 'Ada' } } as ChangeEvent<HTMLInputElement>
    act(() => result.current.handleChange(changeEvent))
    await act(async () => {
      await result.current.handleSubmit(submitEvent)
    })

    expect(mockedSendContactMessage).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ada' })
    )
    expect(showNotification).toHaveBeenCalledWith('contact.form.success', 'success', 6000)
    expect(result.current.formData).toEqual({ name: '', email: '', message: '' })
  })

  it('reports a configuration error when EmailJS is not configured', async () => {
    mockedSendContactMessage.mockRejectedValueOnce(new ContactNotConfiguredError())
    const { result } = renderHook(() => useContactForm(showNotification))

    await act(async () => {
      await result.current.handleSubmit(submitEvent)
    })

    expect(showNotification).toHaveBeenCalledWith('contact.form.emailJsNotConfigured', 'error', 6000)
  })

  it('reports a generic error when sending fails', async () => {
    mockedSendContactMessage.mockRejectedValueOnce(new Error('network down'))
    const { result } = renderHook(() => useContactForm(showNotification))

    await act(async () => {
      await result.current.handleSubmit(submitEvent)
    })

    expect(showNotification).toHaveBeenCalledWith('common.error', 'error', 6000)
  })
})
