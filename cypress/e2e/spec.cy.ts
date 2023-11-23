describe('My First Test', () => {
  it('Sanity test', () => {
    cy.visit('/');
    cy.contains('#header .text-3xl', 'Clipz');
    cy.contains('h1', 'Clip it and ship it!');
  });
});
