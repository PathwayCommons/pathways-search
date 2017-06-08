// import {colaLayout} from './layout/cola';
import colaLayout from './layout/cola.js';
import coseBilkentLayout from './layout/coseBilkent';
import dagreLayout from './layout/dagre';
import presetLayout from './layout/preset';
import klayLayout from './layout/klay';
import stratifiedLayout from './layout/stratified';
import stratifiedKlayLayout from './layout/stratifiedKlay';

export const layoutMap = new Map()
.set('force directed (cola)', colaLayout)
.set('force directed (CoSE-Bilkent)', coseBilkentLayout)
.set('tree / heirarchical (dagre)', dagreLayout)
.set('Pathway Commons Preset', presetLayout)
.set('layered (klay)', klayLayout)
.set('stratified force directed', stratifiedLayout)
.set('stratified layered', stratifiedKlayLayout);


export const defaultLayout = 'layered (klay)';

export const layoutNames = [...layoutMap.keys()];

export const performLayout = (layout, cy, graphJSON={}, options={}) => {
  return layoutMap.get(layout)(cy, graphJSON, options);
};
