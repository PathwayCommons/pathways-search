import cytoscape from 'cytoscape';
import sbgnStyleSheet from 'cytoscape-sbgn-stylesheet';

const stylesheet = sbgnStyleSheet(cytoscape)
.selector('edge')
.css({
  'opacity': 0.3
});

export default stylesheet;