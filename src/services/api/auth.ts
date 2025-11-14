import apiClient from './client'
import type { UserLogin, UserRegister, Token, User } from '@/types/api'

export const authService = {
  /**
   * Register a new user
   */
  async register(data: UserRegister): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', data)
    return response.data
  },

  /**
   * Login user
   */
  async login(credentials: UserLogin): Promise<Token> {
    const response = await apiClient.post<Token>('/auth/login', credentials)
    return response.data
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/users/me')
    return response.data
  },

  /**
   * Logout user (client-side only)
   */
  logout(): void {
    // The actual logout is handled by clearing the token
    // No API call needed as JWT is stateless
  }
}
