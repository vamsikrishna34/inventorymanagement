describe('Inventory Management E2E', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  it('✅ Creates a product, stocks in, and verifies UI', () => {
    // Open create form
    cy.contains('+ Add Product').click();
    cy.get('input[name="name"]').type('Test Widget');
    cy.get('input[name="sku"]').type('TW-001');
    cy.get('input[name="price"]').type('12.99');
    cy.get('input[name="quantity"]').type('10');
    cy.contains('button', 'Create').click();
    
    cy.contains('Product created').should('be.visible');
    cy.contains('TW-001').should('be.visible');

    // Stock In
    cy.contains('TW-001').parent().contains('+ In').click();
    cy.get('input[name="quantity"]').clear().type('20');
    cy.contains('Confirm').click();
    cy.contains('Added 20 units').should('be.visible');
  });

  it('⚠️ Shows low stock warning when threshold crossed', () => {
    // Assumes a product exists with qty=5, threshold=5
    cy.contains('button', '- Out').first().click();
    cy.get('input[name="quantity"]').clear().type('1');
    cy.contains('Confirm').click();
    cy.contains('⚠️ Warning: Stock is at or below threshold').should('be.visible');
  });
});