// import {colaLayout} from './layout/cola';
import colaLayout from './layout/cola.js';
import coseBilkentLayout from './layout/coseBilkent';
import dagreLayout from './layout/dagre';
import presetLayout from './layout/preset';
import klayLayout from './layout/klay';
import stratifiedLayout from './layout/stratified';
import stratifiedKlayLayout from './layout/stratifiedKlay';

export const layoutMap = new Map()
.set('cola - force directed', colaLayout)
.set('CoSE-Bilkent - force directed', coseBilkentLayout)
.set('dagre - tree / heirarchical', dagreLayout)
.set('chilay - Pathway Commons Server Layout', presetLayout)
.set('klay - layered', klayLayout)
.set('stratified force directed', stratifiedLayout)
.set('stratified layered', stratifiedKlayLayout);


export const defaultLayout = 'klay - layered';

export const layoutNames = [...layoutMap.keys()];

export const performLayout = (layout, cy, graphJSON={}, options={}) => {
  return layoutMap.get(layout)(cy, graphJSON, options);
};
