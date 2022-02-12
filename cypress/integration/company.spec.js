describe('company', () => {
  it('should load the company page', () => {
    cy.visit('/1040890-7');

    cy.get('h1').contains('Matkailualan sertifikaatit');
    cy.get('[data-testid="link-to-search"]').should('have.attr', 'href');

    cy.get('[data-testid="print-button"]');

    cy.get('[data-testid="company-name"]').contains('Äksyt Ämmät Oy');
    cy.get('[data-testid="company-address"]').contains('Viemenentie 38, 75500 NURMES');
    cy.get('[data-testid="company-vat"]').contains('1040890-7');

    cy.get('[alt="Sustainable Travel Finland"]')
      .parent()
      .should('have.attr', 'href')
      .should('include', 'sert/sft');

    cy.get('[data-testid="company-certificates"]').should('have.length', '1');
    cy.get('[data-testid="company-certificates"]')
      .get('[alt="TourCert"]')
      .parent()
      .should('have.attr', 'href')
      .should('include', 'sert/tour-cert');
  });
});
