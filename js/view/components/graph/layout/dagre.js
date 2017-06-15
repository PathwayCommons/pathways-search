const dagreLayout = (cy) => {
	cy.layout({
		name: 'dagre',
		rankDir: 'LR'
	}).run();
};

export default dagreLayout;
