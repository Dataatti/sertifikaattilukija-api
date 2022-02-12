describe('index', () => {
  it('should load the index page', () => {
    // Stub window print
    cy.visit('/', {
      onBeforeLoad: (win) => {
        cy.stub(win, 'print');
      },
    });

    cy.get('h1').contains('Matkailualan sertifikaatit');
    cy.get('[data-testid="info-popup"]');
    cy.get('[data-testid="print-button"]');

    cy.get('[data-testid="result-total"]').contains('50 kpl');
    cy.get('[data-testid="company-list"]').find('.company-item').should('have.length', 50);

    // Should hide info popup
    cy.get('[data-testid="info-popup"]').find('[aria-label="Close"]').click();
    cy.get('[data-testid="info-popup"]').should('not.exist');

    // Should open print window
    cy.get('[data-testid="print-button"]').click();

    cy.window().then((win) => {
      expect(win.print).to.be.calledOnce;
    });

    // Should find company by name
    cy.get('[data-testid="name"]').click().type('Hotel Kakola Oy');

    cy.intercept({
      method: 'GET',
      url: '**/api/data?**',
    }).as('getCompanies');

    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@getCompanies');

    cy.get('[data-testid="company-list"]')
      .find('.company-item')
      .should('have.length', 1)
      .contains('Hotel Kakola Oy')
      .should('have.attr', 'href')
      .should('include', '/3093306-3');
  });

  it('should find company by cert and city', () => {
    cy.visit('/');

    cy.get('[data-testid="certificate"]')
      .click()
      .type('Sustainable Travel Finland{downarrow}{enter}');
    cy.get('[data-testid="city"]').click().type('Nurmes{downarrow}{enter}');

    cy.intercept({
      method: 'GET',
      url: '**/api/data?**',
    }).as('getCompanies');

    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@getCompanies');

    cy.get('[data-testid="company-list"]')
      .find('.company-item')
      .should('have.length', 1)
      .contains('Äksyt Ämmät Oy');
    cy.get('.company-item-cert').should('have.length', 2);
    cy.get('.company-item-cert')
      .get('[alt="Sustainable Travel Finland"]')
      .parent()
      .should('have.attr', 'href')
      .should('include', '/sert/sft');
  });

  it('should prefetch cert companies if set in query parameter', () => {
    cy.intercept({
      method: 'GET',
      url: '**/api/data?**',
    }).as('getCompanies');

    cy.visit('/?cert=green-key');

    cy.wait('@getCompanies');

    cy.get('[data-testid="company-list"]').find('.company-item').find('[alt="Green Key"]');
  });
});
