import { ref, type Ref } from 'vue'
import type { AxiosError } from 'axios'
import { handleApiError } from '@/utils/errorHandler'

interface UseApiReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  execute: (...args: any[]) => Promise<T | null>
  reset: () => void
}

/**
 * Generic composable for API calls with loading and error states
 */
export function useApi<T>(apiFunction: (...args: any[]) => Promise<T>): UseApiReturn<T> {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (...args: any[]): Promise<T | null> => {
    loading.value = true
    error.value = null

    try {
      const result = await apiFunction(...args)
      data.value = result as T
      return result
    } catch (err) {
      const axiosError = err as AxiosError
      error.value = handleApiError(axiosError)
      return null
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
  }

  return {
    data: data as Ref<T | null>,
    loading,
    error,
    execute,
    reset
  }
}
