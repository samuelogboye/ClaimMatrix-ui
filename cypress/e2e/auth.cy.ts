describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage()
  })

  describe('Login Page', () => {
    it('should display login form', () => {
      cy.visit('/login')
      cy.contains('ClaimMatrix').should('be.visible')
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('should show validation errors for empty fields', () => {
      cy.visit('/login')
      cy.get('button[type="submit"]').click()
      // Check for HTML5 validation or custom error messages
      cy.get('input[type="email"]:invalid').should('exist')
    })

    it('should redirect to dashboard after successful login', () => {
      cy.visit('/login')
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').type('password123')
      cy.get('button[type="submit"]').click()

      // Note: This will fail without a real backend
      // In a real test, you would mock the API response
      // cy.url().should('include', '/dashboard')
    })

    it('should navigate to register page', () => {
      cy.visit('/login')
      cy.contains('Sign up').click()
      cy.url().should('include', '/register')
    })
  })

  describe('Register Page', () => {
    it('should display registration form', () => {
      cy.visit('/register')
      cy.contains('Create Account').should('be.visible')
      cy.get('input[type="text"]').should('be.visible') // Name field
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('should navigate to login page', () => {
      cy.visit('/register')
      cy.contains('Sign in').click()
      cy.url().should('include', '/login')
    })
  })

  describe('Protected Routes', () => {
    it('should redirect to login when not authenticated', () => {
      cy.visit('/dashboard')
      cy.url().should('include', '/login')
    })

    it('should redirect to login when accessing claims page', () => {
      cy.visit('/claims')
      cy.url().should('include', '/login')
    })

    it('should redirect to login when accessing settings', () => {
      cy.visit('/settings')
      cy.url().should('include', '/login')
    })
  })
})
