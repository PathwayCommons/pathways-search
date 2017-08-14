import cytoscape from 'cytoscape';

//layouts
import cola from 'cytoscape-cola';
import klay from 'cytoscape-klay';
import klayjs from 'klayjs';
import coseBilkent from 'cytoscape-cose-bilkent';
import dagre from 'cytoscape-dagre';

import expandCollapse from 'cytoscape-expand-collapse';

import bindEvents from './events';
import stylesheet from './stylesheet';


cytoscape.use( expandCollapse );
cytoscape.use( cola );
cytoscape.use( coseBilkent );
cytoscape.use( dagre );
cytoscape.use( klay, klayjs ); // cytoscape 3.x extension register

// set the sbgn style sheet
// bind interaction events (mouse hovering, collapsing)
export const initGraph = (graphContainer) => {
  const graphInstance = cytoscape({
    container: graphContainer,
    style: stylesheet,
    minZoom: 0.16,
    maxZoom: 4
  });

  graphInstance.expandCollapse({
    fisheye: true,
    animate: true,
    undoable: false,
    cueEnabled: false
  });

  bindEvents(graphInstance);

  return graphInstance;
};
