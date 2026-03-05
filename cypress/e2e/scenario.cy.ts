describe('Scenario Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display scenarios list page', () => {
    cy.visit('/scenarios')
    cy.get('h1').contains('Scenarios').should('be.visible')
    cy.get('[data-automation-id="scenario-list-new-button"]').should('be.visible')
  })

  it('should navigate to new scenario page', () => {
    cy.visit('/scenarios')
    cy.get('[data-automation-id="scenario-list-new-button"]').click()
    cy.url().should('include', '/scenarios/new')
    cy.get('h1').contains('New Scenario').should('be.visible')
  })

  it('should create a new scenario', () => {
    cy.visit('/scenarios/new')
    
    const timestamp = Date.now()
    const itemName = `test-scenario-${timestamp}`
    
    // Use automation IDs for reliable element selection
    cy.get('[data-automation-id="scenario-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="scenario-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="scenario-new-submit-button"]').click()
    
    // Should redirect to edit page after creation
    cy.url().should('include', '/scenarios/')
    cy.url().should('not.include', '/scenarios/new')
    
    // Verify the scenario name is displayed on edit page
    cy.get('[data-automation-id="scenario-edit-name-input"]').find('input').should('have.value', itemName)
  })

  it('should update a scenario', () => {
    // First create a scenario
    cy.visit('/scenarios/new')
    const timestamp = Date.now()
    const itemName = `test-scenario-update-${timestamp}`
    const updatedName = `updated-scenario-${timestamp}`
    
    cy.get('[data-automation-id="scenario-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="scenario-new-description-input"]').type('Original description')
    cy.get('[data-automation-id="scenario-new-submit-button"]').click()
    
    // Wait for redirect to edit page
    cy.url().should('include', '/scenarios/')
    
    // Update the name field (auto-save on blur)
    cy.get('[data-automation-id="scenario-edit-name-input"]').find('input').clear().type(updatedName)
    cy.get('[data-automation-id="scenario-edit-name-input"]').find('input').blur()
    
    // Wait for save to complete
    cy.wait(1000)
    
    // Verify the update was saved
    cy.get('[data-automation-id="scenario-edit-name-input"]').find('input').should('have.value', updatedName)
    
    // Update description
    cy.get('[data-automation-id="scenario-edit-description-input"]').find('textarea').clear().type('Updated description')
    cy.get('[data-automation-id="scenario-edit-description-input"]').find('textarea').blur()
    cy.wait(1000)
    
    // Update status
    cy.get('[data-automation-id="scenario-edit-status-select"]').click()
    cy.get('.v-list-item').contains('archived').click()
    cy.wait(1000)
    
    // Navigate back to list and verify the scenario appears with updated name
    cy.get('[data-automation-id="scenario-edit-back-button"]').click()
    cy.url().should('include', '/scenarios')
    
    // Search for the updated scenario
    cy.get('[data-automation-id="scenario-list-search"]').find('input').type(updatedName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the scenario appears in the search results
    cy.get('table').should('contain', updatedName)
    
    // Clear search and verify all scenarios are shown again
    cy.get('[data-automation-id="scenario-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })

  it('should search for scenarios', () => {
    // First create a scenario with a unique name
    cy.visit('/scenarios/new')
    const timestamp = Date.now()
    const itemName = `search-test-${timestamp}`
    
    cy.get('[data-automation-id="scenario-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="scenario-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="scenario-new-submit-button"]').click()
    cy.url().should('include', '/scenarios/')
    
    // Navigate to list page
    cy.visit('/scenarios')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the scenario
    cy.get('[data-automation-id="scenario-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the scenario
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all scenarios are shown again
    cy.get('[data-automation-id="scenario-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
