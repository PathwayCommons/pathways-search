import cytoscape from 'cytoscape';
import sbgnStyleSheet from 'sbgn-renderer';
import klay from 'cytoscape-klay';
import klayjs from 'klayjs';
import coseBilkent from 'cytoscape-cose-bilkent';
import expandCollapse from 'cytoscape-expand-collapse';
import convertSbgn from 'sbgnml-to-cytoscape';

expandCollapse( cytoscape );   // TODO use cytoscape 3.x when these are compatible
cytoscape.use( coseBilkent );
cytoscape.use( klay, klayjs ); // cytoscape 3.x extension register

// set the sbgn style sheet
// bind interaction events (mouse hovering, collapsing)
export const initGraph = (graphContainer) => {
  const graphInstance = cytoscape({
    container: graphContainer,
    style: sbgnStyleSheet(cytoscape)
  })

  graphInstance.expandCollapse({
    fisheye: true,
    animate: true,
    undoable: false,
    cueEnabled: false
  });

  graphInstance.style().selector('edge').css({'opacity': 0.3});

  graphInstance.on('mouseover', 'node', function (evt) {
    const node = evt.target;
    if (node.data('class') === 'compartment') {
      return;
    }
    const neighborhood = node.neighborhood();

    node.style({
      'background-color': 'blue',
      'opacity': 1
    });
    neighborhood.nodes().style({
      'background-color': 'blue',
      'opacity': 1,
      'z-compound-depth': 'top'
    });
    neighborhood.edges().style({
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

    node.style({
      'background-color': 'white',
    });
    neighborhood.nodes().style({
      'background-color': 'white',
      'z-compound-depth': 'auto'
    });
    neighborhood.edges().style({
      'line-color': 'black',
      'opacity': 0.3
    });
  });

  graphInstance.on('mouseover', 'edge', function (evt) {
    const edge = evt.target;
    edge.style({
      'line-color': 'orange',
      'opacity': 1
    });

    edge.source().style({
      'background-color': 'blue',
      'z-compound-depth': 'top'

    });
    edge.target().style({
      'background-color': 'blue',
      'z-compound-depth': 'top'
    });
  });

  graphInstance.on('mouseout', 'edge', function (evt) {
    const edge = evt.target;
    edge.style({
      'line-color': 'black',
      'opacity': 0.3
    });

    edge.source().style({
      'background-color': 'white',
      'z-compound-depth': 'auto'
    });
    edge.target().style({
      'background-color': 'white',
      'z-compound-depth': 'auto'
    });
  });

  graphInstance.on('expandcollapse.afterexpand', function (evt) {
    const node = evt.target;
    graphInstance.zoomingEnabled(false);
    node.children().layout({
      name:'grid',
      fit: 'false',
      avoidOverlap: true,
      condense: true,
      animate: true,
      rows: node.children().size() / 2,
      cols: node.children().size() / 2,
      boundingBox: node.boundingBox()
    }).run();
    graphInstance.zoomingEnabled(true);
  });

  graphInstance.on('tap', 'node[class="complex"], node[class="complex multimer"]', function (evt) {
    evt.preventDefault();
    const node = evt.target;
    const api = graphInstance.expandCollapse('get');
    if (api.isCollapsible(node)) {
      api.collapse(node);
    } else {
      api.expand(node);
    }
  });

  return graphInstance;
}