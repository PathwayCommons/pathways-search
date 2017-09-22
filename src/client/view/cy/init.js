import cytoscape from 'cytoscape';

//layouts
import cola from 'cytoscape-cola';
import klay from 'cytoscape-klay';
import klayjs from 'klayjs';
import coseBilkent from 'cytoscape-cose-bilkent';
import dagre from 'cytoscape-dagre';

import compoundCollapse from 'cytoscape-compound-collapse';
import fisheye from 'cytoscape-fisheye';

import stylesheet from './stylesheet';
import bindEvents from './events';


cytoscape.use( cola );
cytoscape.use( coseBilkent );
cytoscape.use( dagre );
cytoscape.use( klay, klayjs ); // cytoscape 3.x extension register
cytoscape.use( fisheye );
cytoscape.use( compoundCollapse );

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
