import colaOpts from './cola';
import coseBilkentOpts from './coseBilkent';
import dagreOpts from './dagre';
import klayOpts from './klay';
import stratifiedLayeredOpts from './stratifiedKlay';

const coseBilkentMaxGraphSize = 100;

export const layoutMap = new Map()
.set('tree / hierarchical (dagre)', dagreOpts)
.set('layered (klay)', klayOpts)
.set('stratified', stratifiedLayeredOpts)
.set('force directed (cola)', colaOpts)
.set('force directed (CoSE-Bilkent)', coseBilkentOpts);


export const defaultLayout = 'layered (klay)';

export const layoutNames = (graphSize) => {
  let defaults = [...layoutMap.keys()];

  if (graphSize >= coseBilkentMaxGraphSize) {
    const index = defaults.indexOf('force directed (CoSE-Bilkent)');

    if (index > -1) {
      defaults.splice(index, 1);
    }
  }

  return defaults;
};

export const getDefaultLayout = (graphSize) => {
  let layout = 'layered (klay)';

  if (graphSize<= coseBilkentMaxGraphSize) {
    layout = 'force directed (CoSE-Bilkent)';
  }

  return layout;
};
