const TOKEN_KEY = 'claimmatrix_token'
const USER_KEY = 'claimmatrix_user'

export const tokenStorage = {
  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  /**
   * Set token
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },

  /**
   * Remove token
   */
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY)
  },

  /**
   * Get stored user data
   */
  getUser(): any {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },

  /**
   * Set user data
   */
  setUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  /**
   * Remove user data
   */
  removeUser(): void {
    localStorage.removeItem(USER_KEY)
  },

  /**
   * Clear all stored data
   */
  clear(): void {
    this.removeToken()
    this.removeUser()
  }
}
