const klayLayout = (cy) => {
  cy.layout({
    name: 'klay',
    klay: {
      borderSpacing: 50,
      separateConnectedComponents: true,
      aspectRatio: cy.width() / cy.height(),
      thoroughness: 7,
      compactComponents: false,
      spacing: 75,
      edgeSpacingFactor: 0.5,
      layoutHierarchy: true
    },
    nodeDimensionsIncludeLabels: true
  }).run();
};

export default klayLayout;
