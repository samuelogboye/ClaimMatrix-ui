import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { handleApiError, logError } from '@/utils/errorHandler'
import { useToast } from 'vue-toastification'
import router from '@/router'

const toast = useToast()

/**
 * Create Axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

/**
 * Request interceptor - Add auth token
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()

    // Add authorization header if token exists
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      })
    }

    return config
  },
  (error) => {
    logError(error, 'Request Interceptor')
    return Promise.reject(error)
  }
)

/**
 * Response interceptor - Handle errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      })
    }

    return response
  },
  async (error) => {
    logError(error, 'Response Interceptor')

    // Get error message
    const errorMessage = handleApiError(error)

    // Handle specific status codes
    if (error.response) {
      const { status } = error.response

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          const authStore = useAuthStore()
          authStore.clearAuth()

          // Only redirect if not already on login page
          if (router.currentRoute.value.name !== 'login') {
            toast.error('Session expired. Please login again.')
            router.push({
              name: 'login',
              query: { redirect: router.currentRoute.value.fullPath }
            })
          }
          break

        case 429:
          // Rate limiting - show warning
          toast.warning(errorMessage)
          break

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors - show error toast
          toast.error(errorMessage)
          break

        // Don't show toast for other errors (handled by components)
      }
    } else {
      // Network error
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default apiClient
