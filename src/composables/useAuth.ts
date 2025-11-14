import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/api/auth'
import { tokenStorage } from '@/services/storage/tokenStorage'
import { useToast } from 'vue-toastification'
import type { UserLogin, UserRegister } from '@/types/api'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const loading = computed(() => authStore.loading)
  const error = computed(() => authStore.error)

  /**
   * Login user
   */
  const login = async (credentials: UserLogin) => {
    authStore.setLoading(true)
    authStore.setError(null)

    try {
      // Get token
      const tokenResponse = await authService.login(credentials)
      authStore.setToken(tokenResponse.access_token)
      tokenStorage.setToken(tokenResponse.access_token)

      // Get user data
      const user = await authService.getCurrentUser()
      authStore.setUser(user)
      tokenStorage.setUser(user)

      toast.success(`Welcome back, ${user.name}!`)

      // Redirect to intended page or dashboard
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/dashboard')
    } catch (err: any) {
      console.log("err.response:", err.response)
      const errorMessage = err.response?.data?.detail || err.response?.data?.error?.message || err.response?.data?.error ||'Login failed'
      authStore.setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      authStore.setLoading(false)
    }
  }

  /**
   * Register new user
   */
  const register = async (data: UserRegister) => {
    authStore.setLoading(true)
    authStore.setError(null)

    try {
      // Register user
      await authService.register(data)

      toast.success('Registration successful! Please login.')

      // Redirect to login
      router.push('/login')
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Registration failed'
      authStore.setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      authStore.setLoading(false)
    }
  }

  /**
   * Logout user
   */
  const logout = () => {
    authStore.clearAuth()
    tokenStorage.clear()
    toast.info('You have been logged out')
    router.push('/login')
  }

  /**
   * Initialize auth from storage
   */
  const initAuth = async () => {
    const token = tokenStorage.getToken()
    const storedUser = tokenStorage.getUser()

    if (token && storedUser) {
      authStore.setToken(token)
      authStore.setUser(storedUser)

      // Optionally refresh user data
      try {
        const user = await authService.getCurrentUser()
        authStore.setUser(user)
        tokenStorage.setUser(user)
      } catch {
        // Token might be expired, logout
        logout()
      }
    }
  }

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    initAuth
  }
}
