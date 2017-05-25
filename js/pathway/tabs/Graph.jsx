import React from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import cytoscape from 'cytoscape';
import sbgnStyleSheet from 'sbgn-renderer';
import klay from 'cytoscape-klay';
import klayjs from 'klayjs';

import SBGNRenderer from 'sbgn-renderer';
import convertSbgn from 'sbgnml-to-cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import expandCollapse from 'cytoscape-expand-collapse';

import {saveAs} from 'file-saver';
import {Spinner} from '../../components/Spinner.jsx';
import {base64toBlob} from '../../helpers/converters.js';
import {ErrorMessage} from '../../components/ErrorMessage.jsx';

expandCollapse( cytoscape );
coseBilkent( cytoscape );
klay( cytoscape, klayjs ); // cytoscape 3.x extension register

// Graph
// Prop Dependencies ::
// - updateGlobal
// - deleteGlobal
// - pathwayData
export class Graph extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			graphId: this.props.id || Math.floor(Math.random() * Math.pow(10, 8)) + 1,
			graphContainer: {},
			graphInstance: {},
			graphRendered: false,
			graphEmpty: false,
			width: "100vw",
			height: "85vh"
		};
	}

	componentWillUnmount() {
		this.props.deleteGlobal("graphImage");
	}

	componentDidMount() {
		var graphContainer = document.getElementById(this.state.graphId);
		var graphInstance = cytoscape({
			container: graphContainer,
			style: sbgnStyleSheet(cytoscape)
		});
		graphInstance.expandCollapse({
			fisheye: true,
			animate: true,
			undoable: false,
			cueEnabled: false
		});

		// TODO: move all of these event binding mechanisms to the viewer-component
		// TODO: make these style values compatible with painter styling e.g don't overwrite styles
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

		this.setState({
			graphInstance: graphInstance,
			graphContainer: graphContainer
		});
		this.checkRenderGraph(this.props.pathwayData);
	}

	shouldComponentUpdate(nextProps, nextState) {
		this.checkRenderGraph(nextProps.pathwayData);
		return true;
	}

	handleResize() {
		var xPosition = 0;
		var yPosition = 0;

		var element = this.state.graphContainer;
		while (element) {
			yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
			element = element.offsetParent;
		}

		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		this.setState({
			width: w,
			height: h - yPosition
		});
	}

	checkRenderGraph(pathwayData) {
		if (!isEmpty(pathwayData) && (!this.state.graphRendered)) {
			this.renderGraph(pathwayData);
		}
	}

	// Graph rendering is not tracked by React
	renderGraph(sbgnString) {
		this.handleResize();
		// Add listener to take care of resize events
		if (window.addEventListener) {
			window.addEventListener('resize', () => {
				this.handleResize();
			}, true);
		}

		// Set global graphImage
		this.props.updateGlobal("graphImage", (isFullscreen, cb) => this.exportImage(isFullscreen, cb));

		// Perform render
		this.state.graphRendered = true;
		const graphJSON = convertSbgn(sbgnString);
		this.state.graphInstance.remove('*');
		this.state.graphInstance.add(graphJSON);

		// TODO move to another package (i.e not here but also not in the sbgn-renderer)
		// remove dangling nodes in compartments
		this.state.graphInstance
			.nodes('[class="compartment"]')
			.children()
			.filterFn((ele) => ele.neighborhood().length === 0)
			.remove();

		// TODO move to another package (i.e not here but also not in the sbgn-renderer)
		// remove dangling orphan nodes
		this.state.graphInstance
			.nodes('[class != "compartment"], [class != "complex"], [class != "complex multimer"]')
			.filterFn((ele) => !ele.isChild() && ele.neighborhood.length === 0)
			.remove();

		// TODO move to another package (i.e not here but also not in the sbgn-renderer)
		// collapse complex nodes by default
		const api = this.state.graphInstance.expandCollapse('get');
		const complexNodes = this.state.graphInstance
			.nodes('[class="complex"], [class="complex multimer"]');
		api.collapseRecursively(complexNodes);

		this.state.graphInstance.layout({
			name: 'klay',
			klay: {
			  borderSpacing: 20,
			  separateConnectedComponents: true,
			  aspectRatio: 1.9,
			  thoroughness: 7,
			  compactComponents: false,
			  spacing: 20,
			  edgeSpacingFactor: 0.5,
			  layoutHierarchy: true
			},
			nodeDimensionsIncludeLabels: true
		}).run();
	};

	exportImage(isFullscreen, cb) {
		if (!isEmpty(this.state.graphInstance)) {
			var imgString = this.state.graphInstance.png({scale: 5, full: Boolean(isFullscreen)});
			imgString = imgString.substring(imgString.indexOf(",") + 1);
			var blob = base64toBlob(imgString, "image/png");
			saveAs(blob, "Graph" + this.state.graphId + ".png");
		}
		if(cb) {
			cb();
		}
	}

	resetImage() {
		if (!isEmpty(this.props.pathwayData)) {
			this.renderGraph(this.state.graphInstance, this.props.pathwayData);
		}
	}

	render() {
		if (!this.state.graphEmpty) {
			return (
				<div className={classNames("Graph", this.props.hidden
					? "visibilityHidden"
					: "")}>
					<div className="graphMenuContainer">
						<div className="graphMenu">
						</div>
					</div>
					<div className="SpinnerContainer">
						<Spinner hidden={this.state.graphRendered}/>
					</div>
					<div id={this.state.graphId} style={{
						width: this.state.width,
						height: this.state.height
					}}/>
				</div>
			);
		}
		else {
			return (
				<ErrorMessage className={classNames("Graph", this.props.hidden ? "visibilityHidden" : "")}>
					No Paths Found
				</ErrorMessage>
			);
		}
	}
}
