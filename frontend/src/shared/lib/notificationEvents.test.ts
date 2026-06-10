import { describe, it, expect, vi } from 'vitest'
import { notificationEvents } from './notificationEvents'

describe('notificationEvents', () => {
  it('calls subscribed listener on emit', () => {
    const listener = vi.fn()
    notificationEvents.subscribe(listener)
    notificationEvents.emit('Test message', 'error')
    expect(listener).toHaveBeenCalledWith({ message: 'Test message', severity: 'error' })
  })

  it('defaults severity to info', () => {
    const listener = vi.fn()
    notificationEvents.subscribe(listener)
    notificationEvents.emit('Info message')
    expect(listener).toHaveBeenCalledWith({ message: 'Info message', severity: 'info' })
  })

  it('calls multiple subscribers', () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    notificationEvents.subscribe(fn1)
    notificationEvents.subscribe(fn2)
    notificationEvents.emit('Broadcast')
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
  })

  it('returns unsubscribe function', () => {
    const listener = vi.fn()
    const unsub = notificationEvents.subscribe(listener)
    unsub()
    notificationEvents.emit('After')
    expect(listener).not.toHaveBeenCalled()
  })

  it('does not call unsubscribed while keeping others', () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    const unsub = notificationEvents.subscribe(fn1)
    notificationEvents.subscribe(fn2)
    unsub()
    notificationEvents.emit('Partial')
    expect(fn1).not.toHaveBeenCalled()
    expect(fn2).toHaveBeenCalledTimes(1)
  })
})
