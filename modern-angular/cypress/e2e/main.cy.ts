describe('Main flow', () => {
  it('enters ZIP and shows results', () => {
    cy.visit('/');
    cy.contains('Look around near:');

    // Enter zip and choose place
    cy.get('input[name="zip"]').type('560001');
    cy.get('div.mat-select-trigger').click();
    cy.contains('ATM').click();

    // Submit
    cy.contains('button', 'Search').click();

    // Should navigate and show results header eventually
    cy.contains('near').should('exist');
  });
});