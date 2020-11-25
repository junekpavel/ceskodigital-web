/// <reference types="cypress" />

describe('Projects', () => {
  it('should successfully load', () => {
    cy.visit('/projects')
    cy.getByCySelector('project').within(() => {
      cy.getByCySelector('project__name').should('not.to.be.empty')
      cy.getByCySelector('project__tagline')
    })
  })
})
