const presetLayout = (cy) => {
	const nodePositions = {};
	cy.nodes().forEach(function (ele) {
		nodePositions[ele.data('id')] = {x: ele.data('bbox').x, y: ele.data('bbox').y};
	});

	cy.layout({
		name: 'preset',
		positions: nodePositions,
		fit: true,
		padding: 50
	}).run();
};

export default presetLayout;
