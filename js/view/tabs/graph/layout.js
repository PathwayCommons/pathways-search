// import {colaLayout} from './layout/cola';
import colaLayout from './layout/cola.js';
import coseBilkentLayout from './layout/coseBilkent';
import dagreLayout from './layout/dagre';
import presetLayout from './layout/preset';
import klayLayout from './layout/klay';
import stratifiedLayout from './layout/stratified';
import stratifiedKlayLayout from './layout/stratifiedKlay';

export const layoutMap = new Map()
.set('cola', colaLayout)
.set('dagre', dagreLayout)
.set('preset', presetLayout)
.set('klay', klayLayout)
.set('stratified', stratifiedLayout)
.set('stratified-klay', stratifiedKlayLayout)
.set('cose-bilkent', coseBilkentLayout);


export const defaultLayout = 'klay';

export const layoutNames = [...layoutMap.keys()];

export const performLayout = (layout, cy, graphJSON={}, options={}) => {
  return layoutMap.get(layout)(cy, graphJSON, options);
};
