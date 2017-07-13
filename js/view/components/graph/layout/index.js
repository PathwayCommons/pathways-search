import colaLayout from './cola';
import coseBilkentLayout from './coseBilkent';
import dagreLayout from './dagre';
import presetLayout from './preset';
import klayLayout from './klay';

export const layoutMap = new Map()
.set('tree / hierarchical (dagre)', dagreLayout)
.set('layered (klay)', klayLayout)
.set('Pathway Commons Preset', presetLayout)
.set('force directed (cola)', colaLayout)
.set('force directed (CoSE-Bilkent)', coseBilkentLayout);

export const defaultLayout = 'layered (klay)';

export const layoutNames = (graphSize) => {
  let defaults = [...layoutMap.keys()];

  if (graphSize >= 120) {
    const index = defaults.indexOf('force directed (CoSE-Bilkent)');

    if (index > -1) {
      defaults.splice(index, 1);
    }
  }

  return defaults;
};

export const getDefaultLayout = (cy) => {
  let layout = 'layered (klay)';

  // if (cy.nodes().size() <= 75) {
  //   layout = 'force directed (CoSE-Bilkent)';
  // }

  return layout;
};

export const performLayout = (layout, cy, graphJSON = {}, options = {}) => {
  return layoutMap.get(layout)(cy, graphJSON, options);
};
