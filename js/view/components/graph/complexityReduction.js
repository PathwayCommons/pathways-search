export const reduceGraphComplexity = (cy) => {
  cy.nodes('[class="complex"], [class="complex multimer"]').collapse();
};
