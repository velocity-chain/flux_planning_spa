describe('Demand Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display demands list page', () => {
    cy.visit('/demands')
    cy.get('h1').contains('Demands').should('be.visible')
    cy.get('[data-automation-id="demand-list-new-button"]').should('be.visible')
  })

  it('should navigate to new demand page', () => {
    cy.visit('/demands')
    cy.get('[data-automation-id="demand-list-new-button"]').click()
    cy.url().should('include', '/demands/new')
    cy.get('h1').contains('New Demand').should('be.visible')
  })

  it('should create a new demand', () => {
    cy.visit('/demands/new')
    
    const timestamp = Date.now()
    const itemName = `test-demand-${timestamp}`
    
    // Use automation IDs for reliable element selection
    cy.get('[data-automation-id="demand-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="demand-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="demand-new-submit-button"]').click()
    
    // Should redirect to edit page after creation
    cy.url().should('include', '/demands/')
    cy.url().should('not.include', '/demands/new')
    
    // Verify the demand name is displayed on edit page
    cy.get('[data-automation-id="demand-edit-name-input"]').find('input').should('have.value', itemName)
  })

  it('should update a demand', () => {
    // First create a demand
    cy.visit('/demands/new')
    const timestamp = Date.now()
    const itemName = `test-demand-update-${timestamp}`
    const updatedName = `updated-demand-${timestamp}`
    
    cy.get('[data-automation-id="demand-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="demand-new-description-input"]').type('Original description')
    cy.get('[data-automation-id="demand-new-submit-button"]').click()
    
    // Wait for redirect to edit page
    cy.url().should('include', '/demands/')
    
    // Update the name field (auto-save on blur)
    cy.get('[data-automation-id="demand-edit-name-input"]').find('input').clear().type(updatedName)
    cy.get('[data-automation-id="demand-edit-name-input"]').find('input').blur()
    
    // Wait for save to complete
    cy.wait(1000)
    
    // Verify the update was saved
    cy.get('[data-automation-id="demand-edit-name-input"]').find('input').should('have.value', updatedName)
    
    // Update description
    cy.get('[data-automation-id="demand-edit-description-input"]').find('textarea').clear().type('Updated description')
    cy.get('[data-automation-id="demand-edit-description-input"]').find('textarea').blur()
    cy.wait(1000)
    
    // Update status
    cy.get('[data-automation-id="demand-edit-status-select"]').click()
    cy.get('.v-list-item').contains('archived').click()
    cy.wait(1000)
    
    // Navigate back to list and verify the demand appears with updated name
    cy.get('[data-automation-id="demand-edit-back-button"]').click()
    cy.url().should('include', '/demands')
    
    // Search for the updated demand
    cy.get('[data-automation-id="demand-list-search"]').find('input').type(updatedName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the demand appears in the search results
    cy.get('table').should('contain', updatedName)
    
    // Clear search and verify all demands are shown again
    cy.get('[data-automation-id="demand-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })

  it('should search for demands', () => {
    // First create a demand with a unique name
    cy.visit('/demands/new')
    const timestamp = Date.now()
    const itemName = `search-test-${timestamp}`
    
    cy.get('[data-automation-id="demand-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="demand-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="demand-new-submit-button"]').click()
    cy.url().should('include', '/demands/')
    
    // Navigate to list page
    cy.visit('/demands')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the demand
    cy.get('[data-automation-id="demand-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the demand
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all demands are shown again
    cy.get('[data-automation-id="demand-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
