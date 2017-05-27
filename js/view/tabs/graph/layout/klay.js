const klayLayout = (cy) => {
  console.log(cy);
  cy.layout({
    name: 'klay',
    klay: {
      borderSpacing: 20,
      separateConnectedComponents: true,
      aspectRatio: cy.width() / cy.height(),
      thoroughness: 7,
      compactComponents: false,
      spacing: 20,
      edgeSpacingFactor: 0.5,
      layoutHierarchy: true
    },
    nodeDimensionsIncludeLabels: true
  }).run();
};

export default klayLayout;