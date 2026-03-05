describe('Navigation Drawer', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should open navigation drawer with hamburger menu', () => {
    cy.visit('/scenarios')
    cy.get('[data-automation-id="nav-drawer-toggle"]').should('be.visible')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    // Check that drawer is visible with domain sections
    cy.contains('SCENARIO DOMAIN').should('be.exist')
    cy.contains('DEMAND DOMAIN').should('be.exist')
    cy.contains('OPTIMIZATION DOMAIN').should('be.exist')
    cy.contains('ORGANIZATION DOMAIN').should('be.exist')
    cy.contains('PRODUCT DOMAIN').should('be.exist')
    cy.contains('SUPPLIER DOMAIN').should('be.exist')
    cy.contains('ANALYTICS DOMAIN').should('be.exist')
  })
  it('should have all scenario domain links in drawer', () => {
    cy.visit('/scenarios')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-scenarios-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-scenarios-new-link"]').should('be.visible')
  })
  it('should have all demand domain links in drawer', () => {
    cy.visit('/demands')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-demands-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-demands-new-link"]').should('be.visible')
  })
  it('should have all optimization domain links in drawer', () => {
    cy.visit('/scenarios')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-optimizations-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-optimizations-new-link"]').should('be.visible')
  })
  it('should have organization domain link in drawer', () => {
    cy.visit('/scenarios')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-organizations-list-link"]').should('be.visible')
  })
  it('should have product domain link in drawer', () => {
    cy.visit('/scenarios')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-products-list-link"]').should('be.visible')
  })
  it('should have supplier domain link in drawer', () => {
    cy.visit('/scenarios')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-suppliers-list-link"]').should('be.visible')
  })
  it('should have analytics domain link in drawer', () => {
    cy.visit('/scenarios')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-analyticss-list-link"]').should('be.visible')
  })

  it('should have admin and logout at bottom of drawer', () => {
    // Login with admin role to see admin link
    cy.login(['admin'])
    cy.visit('/scenarios')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    // Admin and Logout should be visible in the drawer
    cy.get('[data-automation-id="nav-admin-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-logout-link"]').should('be.visible')
  })

  it('should navigate to different pages from drawer', () => {
    cy.visit('/scenarios')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-optimizations-list-link"]').click()
    cy.url().should('include', '/optimizations')
  })

  it('should close drawer after navigation', () => {
    cy.visit('/scenarios')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-optimizations-list-link"]').click()
    
    // Drawer should close after navigation (temporary drawer)
    cy.wait(500)
    cy.contains('SCENARIO DOMAIN').should('not.be.visible')
  })
})