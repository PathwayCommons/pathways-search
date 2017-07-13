import cytoscape from 'cytoscape';
import sbgnStyleSheet from 'cytoscape-sbgn-stylesheet';

const stylesheet = sbgnStyleSheet(cytoscape)
.selector('node[class!="compartment"]')
.css({
  'font-size': 16,
  'color': 'black',
  'text-outline-color': 'white',
  'text-outline-width': 2
})
.selector('edge')
.css({
  'opacity': 0.3
});

export default stylesheet;