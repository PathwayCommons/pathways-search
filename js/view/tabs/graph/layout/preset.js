const presetLayout = (cy, graphJSON) => {
  const nodePositions = {};
  for (let i = 0; i < graphJSON.nodes.length; i++) {
    const xPos = graphJSON.nodes[i].data.bbox.x;
    const yPos = graphJSON.nodes[i].data.bbox.y;
    nodePositions[graphJSON.nodes[i].data.id] = {'x': xPos, 'y': yPos};
  }

  cy.layout({
    name: 'preset',
    positions: nodePositions,
    fit: true,
    padding: 50
  }).run();
};

export default presetLayout;