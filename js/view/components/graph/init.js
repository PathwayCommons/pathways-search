import cytoscape from 'cytoscape';

//layouts
import cola from 'cytoscape-cola';
import klay from 'cytoscape-klay';
import klayjs from 'klayjs';
import coseBilkent from 'cytoscape-cose-bilkent';
import dagre from 'cytoscape-dagre';

import expandCollapse from 'cytoscape-expand-collapse';

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
    minZoom: 0.2,
    maxZoom: 2
  });

  graphInstance.expandCollapse({
    fisheye: true,
    animate: true,
    undoable: false,
    cueEnabled: false
  });

  const storeStyle = (ele, keys) => {
    const storedStyleProps = {};

    for (let key of keys) {
      storedStyleProps[key] = ele.style(key);
    }

    return storedStyleProps;
  };

  graphInstance.on('mouseover', 'node', function (evt) {
    const node = evt.target;

    const scalingFactor = ( 1 / graphInstance.zoom() );
    const dynamicFontSize = scalingFactor * 25;
    const dynamicFontOutlineWidth = scalingFactor * 3;
    const dynamicArrowSize = scalingFactor * 2.5;
    
    if (node.data('class') === 'compartment') { return; }

    const neighborhood = node.neighborhood();

    const nodeStyleProps = ['font-size', 'color', 'text-outline-color', 'text-outline-width', 'background-color', 'opacity'];
    node.scratch('_hover-style-before', storeStyle(node, nodeStyleProps));
    node.style({
      'font-size': dynamicFontSize,
      'color': 'white',
      'text-outline-color': 'black',
      'text-outline-width': dynamicFontOutlineWidth,
      'background-color': 'blue',
      'opacity': 1
    });


    const neighborhoodNodeStyleProps = ['font-size', 'color', 'text-outline-color', 'text-outline-width', 'background-color', 'opacity', 'z-compound-depth'];
    neighborhood.nodes().forEach((node) => node.scratch('_hover-style-before', storeStyle(node, neighborhoodNodeStyleProps)));	
    neighborhood.nodes().style({
      'font-size': dynamicFontSize,
      'color': 'white',
      'text-outline-color': 'black',
      'text-outline-width': dynamicFontOutlineWidth,
      'background-color': 'blue',
      'opacity': 1,
      'z-compound-depth': 'top'
    });
    
    const neighborhoodEdgeStyleProps = ['arrow-scale', 'line-color', 'opacity'];
    neighborhood.edges().forEach((edge) => edge.scratch('_hover-style-before', storeStyle(edge, neighborhoodEdgeStyleProps)));
    neighborhood.edges().style({
      'arrow-scale': dynamicArrowSize,
      'line-color': 'orange',
      'opacity': 1
    });
  });

  graphInstance.on('mouseout', 'node', function (evt) {
    const node = evt.target;

    if (node.data('class') === 'compartment') {
      return;
    }
    const neighborhood = node.neighborhood();

    node.style(node.scratch('_hover-style-before'));
    node.removeScratch('_hover-style-before');

    neighborhood.nodes().forEach((node) => {
      node.style(node.scratch('_hover-style-before'));
      node.removeScratch('_hover-style-before');
    });
    
    neighborhood.edges().forEach((edge) => {
      edge.style(edge.scratch('_hover-style-before'));
      edge.removeScratch('_hover-style-before');
    });
  });

  graphInstance.on('mouseover', 'edge', function (evt) {
    const edge = evt.target;

    const scalingFactor = ( 1 / graphInstance.zoom() );
    const dynamicFontSize = scalingFactor * 25;
    const dynamicFontOutlineWidth = scalingFactor * 3;
    const dynamicArrowSize = scalingFactor * 2.5;

    const edgeStyleProps = ['line-color', 'opacity', 'arrow-scale'];
    edge.scratch('_hover-style-before', storeStyle(edge, edgeStyleProps));
    edge.style({
      'arrow-scale': dynamicArrowSize,
      'line-color': 'orange',
      'opacity': 1
    });

    const sourceStyleProps = ['font-size', 'color', 'text-outline-color', 'text-outline-width', 'background-color', 'opacity', 'z-compound-depth'];

    edge.source().scratch('_hover-style-before', storeStyle(edge.source(), sourceStyleProps));
    edge.source().style({
      'font-size': dynamicFontSize,
      'color': 'white',
      'text-outline-color': 'black',
      'text-outline-width': dynamicFontOutlineWidth,
      'opacity': 1,
      'background-color': 'blue',
      'z-compound-depth': 'top'
    });

    edge.target().scratch('_hover-style-before', storeStyle(edge.target(), sourceStyleProps));
    edge.target().style({
      'font-size': dynamicFontSize,
      'color': 'white',
      'text-outline-color': 'black',
      'text-outline-width': dynamicFontOutlineWidth,
      'opacity': 1,
      'background-color': 'blue',
      'z-compound-depth': 'top'
    });
  });

  graphInstance.on('mouseout', 'edge', function (evt) {
    const edge = evt.target;

    edge.style(edge.scratch('_hover-style-before'));
    edge.removeScratch('_hover-style-before');

    edge.source().style(edge.source().scratch('_hover-style-before'));
    edge.source().removeScratch('_hover-style-before');

    edge.target().style(edge.target().scratch('_hover-style-before'));
    edge.target().removeScratch('_hover-style-before');
  });

  graphInstance.on('tap', 'node[class="complex"], node[class="complex multimer"]', function (evt) {
    evt.preventDefault();
    const node = evt.target;
    const api = graphInstance.expandCollapse('get');
    if (api.isCollapsible(node)) {
      api.collapse(node);
    } else {
      api.expand(node, {
        layoutBy: () => {
          node.children().positions(node.position());
          node.children().layout({
            name: 'grid',
            fit: false,
            avoidOverlap: true,
            condense: true,
            animate: true,
            boundingBox: node.boundingBox()
          }).run();
        }
      });
    }
  });

  return graphInstance;
};
