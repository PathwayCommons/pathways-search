const dagreLayout = (cy) => {
	cy.layout({
		name: 'dagre'
	}).run();
};

export default dagreLayout;
