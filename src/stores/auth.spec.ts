import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './auth'

// Mock the API service
vi.mock('@/services/api/auth', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    getCurrentUser: vi.fn()
  }
}))

// Mock router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with null user and token', () => {
    const store = useAuthStore()

    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should compute isAuthenticated correctly', () => {
    const store = useAuthStore()

    expect(store.isAuthenticated).toBe(false)

    store.token = 'fake-token'
    store.user = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    expect(store.isAuthenticated).toBe(true)
  })

  it('should get user name from user object', () => {
    const store = useAuthStore()

    expect(store.userName).toBe('')

    store.user = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    expect(store.userName).toBe('Test User')
  })

  it('should logout and clear user data', () => {
    const store = useAuthStore()

    // Set up authenticated state
    store.token = 'fake-token'
    store.user = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    localStorage.setItem('token', 'fake-token')

    store.logout()

    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('should load token from localStorage on init', () => {
    localStorage.setItem('token', 'stored-token')

    const store = useAuthStore()

    expect(store.token).toBe('stored-token')
  })
})
