const colaOpts = {
  name: 'cola',
  fit: true,
  nodeSpacing: function( node ){
    if (node.data('class').includes('process')) {
      return 40;
    } else {
      return 0;
    }
  } // extra spacing around nodes
};

const klayOpts = {
  name: 'klay',
  klay: {
    borderSpacing: 20,
    separateConnectedComponents: true,
    aspectRatio: 1.8,
    thoroughness: 7,
    compactComponents: false,
    spacing: 20,
    edgeSpacingFactor: 0.5,
    layoutHierarchy: true
  },
  nodeDimensionsIncludeLabels: true
};

const coseBilkentOpts = {
  name: 'cose-bilkent',
  paddingCompound: 50,
  fit: true,
  nodeRepulsion: 4500,
  idealEdgeLength: 50,
  edgeElasticity: 0.45,
  nestingFactor: 0.1,
  gravity: 0.25,
  numIter: 2500,
  tile: false,
  animationEasing: 'cubic-bezier(0.19, 1, 0.22, 1)',
  animate: 'end',
  animationDuration: 1000,
  randomize: true,
  tilingPaddingVertical: 20,
  tilingPaddingHorizontal: 20,
  gravityRangeCompound: 1.5,
  gravityCompound: 1.0,
  gravityRange: 3.8,
};


export const performLayout = (cy, layout) => {
  return;
};
