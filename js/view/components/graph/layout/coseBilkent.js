const coseBilkentLayout = (cy) => {
  cy.layout({
    name: 'cose-bilkent',
    fit: true,
    randomize: false,
    animationEasing: 'ease-out-cubic',
    animationDuration: 2000,
    tilingPaddingVertical: 20,
    tilingPaddingHorizontal: 20
  }).run();
};

export default coseBilkentLayout;
