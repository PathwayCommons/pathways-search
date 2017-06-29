const coseBilkentLayout = (cy) => {
	cy.layout({
		name: 'cose-bilkent',
		fit: true,
		animationEasing: 'cubic-bezier(0.19, 1, 0.22, 1)',
		animationDuration: 1000,
		tilingPaddingVertical: 20,
		tilingPaddingHorizontal: 20
	}).run();
};

export default coseBilkentLayout;
