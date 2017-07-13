const stratifiedKlay = (cy) => {
  cy.layout({
    name: 'klay',
    klay: {
      borderSpacing: 10,
      separateConnectedComponents: false,
      aspectRatio: cy.width() / cy.height(),
      thoroughness: 1000,
      compactComponents: false,
      spacing: 60,
      edgeSpacingFactor: 0.5,
      layoutHierarchy: false
    },
    nodeDimensionsIncludeLabels: true
  }).run();
};

export default stratifiedKlay;
