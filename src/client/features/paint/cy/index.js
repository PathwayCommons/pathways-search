import cytoscape from 'cytoscape';

import stylesheet from './stylesheet';
import bindEvents from './events';


// set the sbgn style sheet
// bind interaction events (mouse hovering, collapsing)
export default (opts) => {
  const cy = cytoscape({
    container: opts.container,
    style: stylesheet,
    minZoom: 0.16,
    maxZoom: 4,
    headless: opts.headless
  });

  bindEvents(cy);

  return cy;
};
