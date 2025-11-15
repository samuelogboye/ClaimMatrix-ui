describe('Navigation and Keyboard Shortcuts', () => {
  beforeEach(() => {
    // In a real app, you would login first
    // cy.login('test@example.com', 'password123')
    cy.visit('/login')
  })

  describe('Command Palette', () => {
    it('should open command palette with Cmd+K', () => {
      cy.get('body').type('{meta}k')
      cy.contains('Search or jump to').should('be.visible')
    })

    it('should open command palette with Ctrl+K', () => {
      cy.get('body').type('{ctrl}k')
      cy.contains('Search or jump to').should('be.visible')
    })

    it('should filter commands when typing', () => {
      cy.get('body').type('{meta}k')
      cy.get('input[placeholder*="Search"]').type('claims')
      cy.contains('All Claims').should('be.visible')
      cy.contains('Flagged Claims').should('be.visible')
    })

    it('should close command palette on Escape', () => {
      cy.get('body').type('{meta}k')
      cy.contains('Search or jump to').should('be.visible')
      cy.get('body').type('{esc}')
      cy.contains('Search or jump to').should('not.exist')
    })
  })

  describe('Keyboard Shortcuts Help', () => {
    it('should open shortcuts modal with ?', () => {
      cy.get('body').type('?')
      cy.contains('Keyboard Shortcuts').should('be.visible')
    })

    it('should display shortcut categories', () => {
      cy.get('body').type('?')
      cy.contains('General').should('be.visible')
      cy.contains('Navigation').should('be.visible')
      cy.contains('Tables').should('be.visible')
    })

    it('should close shortcuts modal', () => {
      cy.get('body').type('?')
      cy.contains('Got it!').click()
      cy.contains('Keyboard Shortcuts').should('not.exist')
    })
  })

  describe('404 Page', () => {
    it('should display 404 page for unknown routes', () => {
      cy.visit('/unknown-route', { failOnStatusCode: false })
      cy.contains('404').should('be.visible')
    })
  })
})
