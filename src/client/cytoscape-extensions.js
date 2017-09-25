import cytoscape from 'cytoscape';

//layouts
import cola from 'cytoscape-cola';
import klay from 'cytoscape-klay';
import klayjs from 'klayjs';
import coseBilkent from 'cytoscape-cose-bilkent';
import dagre from 'cytoscape-dagre';

import compoundCollapse from 'cytoscape-compound-collapse';
import fisheye from 'cytoscape-fisheye';


export default () => {
  cytoscape.use(cola);
  cytoscape.use(klay, klayjs);
  cytoscape.use(coseBilkent);
  cytoscape.use(dagre);
  cytoscape.use(compoundCollapse);
  cytoscape.use(fisheye);
};