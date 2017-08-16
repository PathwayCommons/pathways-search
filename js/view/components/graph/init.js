import cytoscape from 'cytoscape';

//layouts
import cola from 'cytoscape-cola';
import klay from 'cytoscape-klay';
import klayjs from 'klayjs';
import coseBilkent from 'cytoscape-cose-bilkent';
import dagre from 'cytoscape-dagre';

import compoundCollapse from 'cytoscape-compound-collapse';
import fisheye from 'cytoscape-fisheye';

import bindEvents from './events';
import stylesheet from './stylesheet';


cytoscape.use( cola );
cytoscape.use( coseBilkent );
cytoscape.use( dagre );
cytoscape.use( klay, klayjs ); // cytoscape 3.x extension register
cytoscape.use( fisheye );
cytoscape.use( compoundCollapse );

// set the sbgn style sheet
// bind interaction events (mouse hovering, collapsing)
export const initGraph = (graphContainer) => {
  const graphInstance = cytoscape({
    container: graphContainer,
    style: stylesheet,
    minZoom: 0.16,
    maxZoom: 4
  });

  bindEvents(graphInstance);

  return graphInstance;
};
