import cytoscape from 'cytoscape';
import sbgnStyleSheet from 'cytoscape-sbgn-stylesheet';

const stylesheet = sbgnStyleSheet(cytoscape)
.selector('node').css({
  'text-wrap': 'wrap',
  'text-max-width': 150
})
.selector('node[class!="compartment"]')
.css({
  'font-size': 20,
  'color': 'black',
  'text-outline-color': 'white',
  'text-outline-width': 2,
  'text-outline-opacity': 0.5
})
.selector('node[class="complex"]')
.css({
  'content': (node) => node.data('label').split(':').join(' '),
  'width': 30,
  'height': 30
})
.selector('.cy-expand-collapse-collapsed-node')
.css({
  'background-color': '#3f3c3c',
  'color': 'white',
  'text-outline-color': 'black',
  'text-outline-width': 2,
  'text-outline-opacity': 1,
  'text-valign': 'center'
})
.selector('edge')
.css({
  'opacity': 0.3
});

export default stylesheet;