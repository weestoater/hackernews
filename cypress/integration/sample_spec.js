import { createYield } from "typescript";

describe('My First Test', function() {

      it('Visits the Kitchen Sink', function() {
            cy.visit('https://example.cypress.io')
      })

      it('- finds the content "type"', function() {
            cy.visit('https://example.cypress.io')
            cy.contains('type')
      })

      it('- clicks the link "type"', function() {
            cy.visit('https://example.cypress.io')
            cy.contains('type').click()
            cy.url().should('include', '/commands/actions')

            // Get an input, type into it and verify that the value has been updated
            cy.get('.action-email')
                  .type('fake@email.com')
                  .should('have.value', 'fake@email.com')
      })

})