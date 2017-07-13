import cellularVocabularyOrder from './cellularVocabularyOrder';

const stratifiedKlayLayout = (cy) => {

  const compartments = cy.nodes('[class="compartment"]')
  .sort((a, b) => cellularVocabularyOrder(a.data('id')) - cellularVocabularyOrder(b.data('id')));

  let yOffset = 0;
  compartments.forEach((c, i) => {
    const eles = c.union(c.descendants());

    eles.layout({
      name: 'klay',
      klay: {
        // spacing: 40,
        // separateConnectedComponents: false,
        // aspectRatio: cy.width() / cy.height(),
        aspectRatio: 3.0,
        // thoroughness: 7,
        // compactComponents: true,
        // spacing: 20,
        // edgeSpacingFactor: 0.5,
        direction: 'UP',
        // layoutHierarchy: false
      },
      nodeDimensionsIncludeLabels: true,
      stop: function () {
        eles.positions(function (node) {
          const curPos = node.position();
          return {
            x: curPos.x,
            y: curPos.y + yOffset
          };
        });
        yOffset += 400;
      }
    }).run();
  });
  cy.fit();
};

export default stratifiedKlayLayout;
