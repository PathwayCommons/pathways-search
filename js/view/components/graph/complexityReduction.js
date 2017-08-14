export const reduceGraphComplexity = (cy) => {
  const api = cy.expandCollapse('get');
  const complexes = cy.nodes('[class="complex"], [class="complex multimer"]');
  api.collapseRecursively(complexes);

};
