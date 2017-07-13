const klayLayout = (cy) => {
  cy.layout({
    name: 'klay',
    klay: {
      borderSpacing: 10,
      separateConnectedComponents: true,
      aspectRatio: cy.width() / cy.height(),
      thoroughness: 100,
      compactComponents: false,
      spacing: 50,
      edgeSpacingFactor: 0.01,
      linearSegmentsDeflectionDampening: 3.9,
      layoutHierarchy: true
    },
    nodeDimensionsIncludeLabels: false
  }).run();
};

export default klayLayout;
