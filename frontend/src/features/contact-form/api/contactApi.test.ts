import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import emailjs from '@emailjs/browser'
import { ContactNotConfiguredError, ContactTimeoutError, sendContactMessage } from './contactApi'

vi.mock('@emailjs/browser', () => ({ default: { send: vi.fn() } }))

const mockedSend = vi.mocked(emailjs.send)
const message = { name: 'Ada', email: 'ada@example.com', message: 'Hello' }

const configure = () => {
  vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'service_test')
  vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'template_test')
  vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'public_test')
}

describe('sendContactMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.useRealTimers()
  })

  it('refuses to send when EmailJS is not configured', async () => {
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', '')

    await expect(sendContactMessage(message)).rejects.toBeInstanceOf(ContactNotConfiguredError)
    expect(mockedSend).not.toHaveBeenCalled()
  })

  it('sends the message with an unambiguous timestamp, headless blocking and a rate limit', async () => {
    configure()
    mockedSend.mockResolvedValueOnce({ status: 200, text: 'OK' })

    await sendContactMessage(message)

    const [serviceId, templateId, params, options] = mockedSend.mock.calls[0]
    expect([serviceId, templateId]).toEqual(['service_test', 'template_test'])
    expect(params).toMatchObject(message)
    expect(String(params?.time)).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    expect(options).toMatchObject({ publicKey: 'public_test', blockHeadless: true, limitRate: { throttle: 10000 } })
  })

  it('gives up after the timeout with a dedicated error', async () => {
    configure()
    vi.useFakeTimers()
    mockedSend.mockReturnValueOnce(new Promise(() => {}))

    const sending = sendContactMessage(message)
    const outcome = expect(sending).rejects.toBeInstanceOf(ContactTimeoutError)
    await vi.advanceTimersByTimeAsync(15000)

    await outcome
  })
})
