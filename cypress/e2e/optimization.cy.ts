describe('Optimization Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display optimizations list page', () => {
    cy.visit('/optimizations')
    cy.get('h1').contains('Optimizations').should('be.visible')
    cy.get('[data-automation-id="optimization-list-new-button"]').should('be.visible')
  })

  it('should navigate to new optimization page', () => {
    cy.visit('/optimizations')
    cy.get('[data-automation-id="optimization-list-new-button"]').click()
    cy.url().should('include', '/optimizations/new')
    cy.get('h1').contains('New Optimization').should('be.visible')
  })

  it('should create a new optimization document', () => {
    cy.visit('/optimizations/new')
    
    const timestamp = Date.now()
    const itemName = `test-optimization-${timestamp}`
    
    cy.get('[data-automation-id="optimization-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="optimization-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="optimization-new-status-input"]').type('active')
    cy.get('[data-automation-id="optimization-new-submit-button"]').click()
    
    // Should redirect to view page after creation
    cy.url().should('include', '/optimizations/')
    cy.url().should('not.include', '/optimizations/new')
    
    // Verify the optimization name is displayed on view page (in a text field, not h1)
    cy.get('input[readonly]').first().should('have.value', itemName)
  })

  it('should search for optimizations', () => {
    // First create a optimization with a unique name
    cy.visit('/optimizations/new')
    const timestamp = Date.now()
    const itemName = `search-test-optimization-${timestamp}`
    
    cy.get('[data-automation-id="optimization-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="optimization-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="optimization-new-status-input"]').type('active')
    cy.get('[data-automation-id="optimization-new-submit-button"]').click()
    cy.url().should('include', '/optimizations/')
    
    // Navigate to list page
    cy.visit('/optimizations')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the optimization
    cy.get('[data-automation-id="optimization-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the optimization
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all optimizations are shown again
    cy.get('[data-automation-id="optimization-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
