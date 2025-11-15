import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should debounce value changes', () => {
    const value = ref('initial')
    const debouncedValue = useDebounce(value, 300)

    expect(debouncedValue.value).toBe('initial')

    value.value = 'updated'
    expect(debouncedValue.value).toBe('initial') // Not updated yet

    vi.advanceTimersByTime(150)
    expect(debouncedValue.value).toBe('initial') // Still not updated

    vi.advanceTimersByTime(150)
    expect(debouncedValue.value).toBe('updated') // Now updated
  })

  it('should reset timer on rapid changes', () => {
    const value = ref('initial')
    const debouncedValue = useDebounce(value, 300)

    value.value = 'first'
    vi.advanceTimersByTime(100)

    value.value = 'second'
    vi.advanceTimersByTime(100)

    value.value = 'third'
    vi.advanceTimersByTime(100)

    expect(debouncedValue.value).toBe('initial') // Not updated yet

    vi.advanceTimersByTime(200)
    expect(debouncedValue.value).toBe('third') // Updated to last value
  })

  it('should use custom delay', () => {
    const value = ref('initial')
    const debouncedValue = useDebounce(value, 1000)

    value.value = 'updated'

    vi.advanceTimersByTime(500)
    expect(debouncedValue.value).toBe('initial')

    vi.advanceTimersByTime(500)
    expect(debouncedValue.value).toBe('updated')
  })
})
