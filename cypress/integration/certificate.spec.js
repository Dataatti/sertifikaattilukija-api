describe('certificate', () => {
  it('should load the certificate page', () => {
    cy.visit('/sert/green-key');

    cy.get('h1').contains('Matkailualan sertifikaatit');
    cy.get('[data-testid="link-to-search"]').should('have.attr', 'href');

    cy.get('[data-testid="print-button"]');

    cy.get('[data-testid="cert-name"]').contains('Green Key');
    cy.get('[data-testid="cert-desc"]').contains(
      'Green Key on kansainvälinen hotelli- ja matkailualalle suunnattu ympäristö- ja vastuullisuusmerkki'
    );
    cy.get('[data-testid="cert-website"]')
      .contains('https://greenkey.fi')
      .should('have.attr', 'href')
      .should('eq', 'https://greenkey.fi');

    cy.get('[alt="Green Key"]');

    cy.get('[data-testid="cert-companies"]')
      .should('have.attr', 'href')
      .should('include', '?cert=green-key');
  });
});
