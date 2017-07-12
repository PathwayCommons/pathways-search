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

  const dynamicScalingfactors = (zoom) => {
    const scalingFactor = ( 1 / zoom );
    const defaults = {
      fontSize: 80,
      outlineWidth: 8,
      arrowScale: 8
    };

    const dynamicFontSize = Math.min(defaults.fontSize, Math.max(scalingFactor * 18, 18));
    const dynamicFontOutlineWidth = Math.min(defaults.outlineWidth, Math.max(scalingFactor * 3, 3));
    const dynamicArrowScale = Math.min(defaults.arrowScale, Math.max(scalingFactor * 2.5, 2.5));

    return {
      fontSize: dynamicFontSize,
      outlineWidth: dynamicFontOutlineWidth,
      arrowScale: dynamicArrowScale
    };
  };

  const applyHoverStyle = (eles, style) => {
    const stylePropNames = Object.keys(style);

    eles.forEach((ele) => {
      ele.scratch('_hover-style-before', storeStyle(ele, stylePropNames));
    });
    
    graphInstance.batch(function () {
      eles.style(style);
    });
  };

  const removeHoverStyle = (eles) => {

    graphInstance.batch(function () {
      eles.forEach((ele) => {
        ele.style(ele.scratch('_hover-style-before'));
        ele.removeScratch('_hover-style-before');
      });
    });
  };

  graphInstance.on('mouseover', 'node', function (evt) {
    const node = evt.target;

    if (node.data('class') === 'compartment') { return; }
    if (node.isParent()) { return; }

    const { fontSize, outlineWidth, arrowScale } = dynamicScalingfactors(graphInstance.zoom());
    
    const nodeHoverStyle = {
      'font-size': fontSize,
      'color': 'white',
      'text-outline-color': 'black',
      'text-outline-width': outlineWidth,
      'background-color': 'blue',
      'opacity': 1,
      'z-compound-depth': 'top'
    };

    const edgeHoverStyle = {
      'arrow-scale': arrowScale,
      'line-color': 'orange',
      'opacity': 1
    };

    const neighborhood = node.neighborhood();

    applyHoverStyle(neighborhood.nodes(), nodeHoverStyle);
    applyHoverStyle(node, nodeHoverStyle);
    applyHoverStyle(neighborhood.edges(), edgeHoverStyle);
  });

  graphInstance.on('mouseout', 'node', function (evt) {
    const node = evt.target;

    if (node.data('class') === 'compartment') { return; }

    const neighborhood = node.neighborhood();

    removeHoverStyle(neighborhood.nodes());
    removeHoverStyle(node);
    removeHoverStyle(neighborhood.edges());
  });

  graphInstance.on('mouseover', 'edge', function (evt) {
    const edge = evt.target;

    const { fontSize, outlineWidth, arrowScale } = dynamicScalingfactors(graphInstance.zoom());

    const edgeHoverStyle = {
      'arrow-scale': arrowScale,
      'line-color': 'orange',
      'opacity': 1
    };

    const nodeHoverStyle = {
      'font-size': fontSize,
      'color': 'white',
      'text-outline-color': 'black',
      'text-outline-width': outlineWidth,
      'opacity': 1,
      'background-color': 'blue',
      'z-compound-depth': 'top'
    };

    applyHoverStyle(edge, edgeHoverStyle);
    applyHoverStyle(edge.source(), nodeHoverStyle);
    applyHoverStyle(edge.target(), nodeHoverStyle);
  });

  graphInstance.on('mouseout', 'edge', function (evt) {
    const edge = evt.target;

    removeHoverStyle(edge);
    removeHoverStyle(edge.source());
    removeHoverStyle(edge.target());
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
