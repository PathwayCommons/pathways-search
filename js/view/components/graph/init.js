import cytoscape from 'cytoscape';
import extend from 'extend';

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
      arrowScale: 8,
      edgeWidth: 4,
    };

    const dynamicFontSize = Math.min(defaults.fontSize, Math.max(scalingFactor * 18, 18));
    const dynamicFontOutlineWidth = Math.min(defaults.outlineWidth, Math.max(scalingFactor * 3, 3));
    const dynamicArrowScale = Math.min(defaults.arrowScale, Math.max(scalingFactor * 2.5, 2.5));
    const dynamicEdgewidth = Math.min(defaults.edgeWidth, Math.max(scalingFactor * 2.5, 2.5));

    return {
      fontSize: dynamicFontSize,
      outlineWidth: dynamicFontOutlineWidth,
      arrowScale: dynamicArrowScale,
      edgeWidth: dynamicEdgewidth
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

  const scaledDimensions = (node, zoom) => {
    const nw = node.outerWidth();
    const nh = node.outerHeight();

    if (nw === 0 || nh === 0) { return { w: 0, h: 0};}

    const scaledVal = (1 / zoom) * 3;
    const aspectRatio = nw / nh;
    let xIncr = 0;
    let yIncr = 0;

    if (aspectRatio > 1) {
      xIncr = nw + scaledVal;
      yIncr = nh + (scaledVal / aspectRatio);
    } else {
      xIncr = nw + (scaledVal / aspectRatio);
      yIncr = nh + scaledVal;
    }

    return {
      w: xIncr,
      h: yIncr
    };
  };

  const baseNodeHoverStyle =  {
    'background-color': 'blue',
    'opacity': 1,
    'z-compound-depth': 'top',
    'color': 'white',
    'text-outline-color': 'black'
  };

  const baseEdgeHoverStyle = {
    'line-color': 'orange',
    'opacity': 1
  };

  graphInstance.on('mouseover', 'node', function (evt) {
    const node = evt.target;
    const currZoom = graphInstance.zoom();

    if (node.data('class') === 'compartment') { return; }
    if (node.isParent()) { return; }

    const { fontSize, outlineWidth, arrowScale, edgeWidth } = dynamicScalingfactors(currZoom);


    node.neighborhood().nodes().union(node).forEach((node) => {
      const { w, h } = scaledDimensions(node, currZoom);

      const nodeHoverStyle = extend({}, baseNodeHoverStyle, {
        'font-size': fontSize,
        'text-outline-width': outlineWidth,
        'width': w,
        'height': h
      });

      applyHoverStyle(node, nodeHoverStyle);
    });

    const edgeHoverStyle = extend({}, baseEdgeHoverStyle, {
      'arrow-scale': arrowScale,
      'width': edgeWidth
    });

    applyHoverStyle(node.neighborhood().edges(), edgeHoverStyle);
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
    const currZoom = graphInstance.zoom();

    const { fontSize, outlineWidth, arrowScale, edgeWidth } = dynamicScalingfactors(currZoom);

    const edgeHoverStyle = extend({}, baseEdgeHoverStyle, {
      'arrow-scale': arrowScale,
      'width': edgeWidth
    });
    applyHoverStyle(edge, edgeHoverStyle);


    edge.source().union(edge.target()).forEach((node) => {
      const { w, h } = scaledDimensions(node, currZoom);
      const nodeHoverStyle = extend({}, baseNodeHoverStyle, {
        'width': w,
        'height': h,
        'font-size': fontSize,
        'color': 'white',
        'text-outline-color': 'black',
        'text-outline-width': outlineWidth,
        'opacity': 1,
        'background-color': 'blue',
        'z-compound-depth': 'top'
      });
      applyHoverStyle(node, nodeHoverStyle);
    });
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
