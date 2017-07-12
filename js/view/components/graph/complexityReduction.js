export const reduceGraphComplexity = (cy) => {
	const compartmentChildren = cy.nodes('[class="compartment"]').children();
	compartmentChildren.filterFn((ele) => ele.neighborhood().length === 0).remove();

	const danglingNodes = cy.nodes('[class != "compartment"], [class != "complex"], [class != "complex multimer"]');
	danglingNodes.filterFn((ele) => !ele.isChild() && ele.neighborhood.length === 0).remove();

	const api = cy.expandCollapse('get');
	const complexes = cy.nodes('[class="complex"], [class="complex multimer"]');
	api.collapseRecursively(complexes);

};
