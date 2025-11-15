/// <reference types="cypress" />

// Custom command to login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard')
})

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="user-menu"]').click()
  cy.get('[data-cy="logout-button"]').click()
  cy.url().should('include', '/login')
})

// Custom command to check if authenticated
Cypress.Commands.add('checkAuthenticated', () => {
  const token = localStorage.getItem('token')
  expect(token).to.not.be.null
})

// Declare custom commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      logout(): Chainable<void>
      checkAuthenticated(): Chainable<void>
    }
  }
}

export {}
