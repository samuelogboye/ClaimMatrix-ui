import { ref, watch, type Ref } from 'vue'

/**
 * Debounce a value with configurable delay
 */
export function useDebounce<T>(value: Ref<T>, delay = 300): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>
  let timeout: ReturnType<typeof setTimeout>

  watch(
    value,
    (newValue) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        debouncedValue.value = newValue
      }, delay)
    },
    { immediate: true }
  )

  return debouncedValue
}

/**
 * Debounce a function
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
