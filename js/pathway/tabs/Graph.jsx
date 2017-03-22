import React from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import SBGNViz from 'sbgn-renderer';
import {saveAs} from 'file-saver';
import {Spinner} from '../../components/Spinner.jsx';
import {base64toBlob} from '../../helpers/converters.js';
import {ErrorMessage} from '../../components/ErrorMessage.jsx';

// Graph
// Prop Dependencies ::
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
		}
	}

	componentDidMount() {
		var graphContainer = document.getElementById(this.state.graphId);
		let sbgnViz = new SBGNViz({container: graphContainer});
		this.setState({
			graphInstance: sbgnViz,
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
		if (this.checkEmptyGraph(pathwayData)) {
			this.state.graphEmpty = true;
		}
		if (!isEmpty(pathwayData) && (!this.state.graphRendered)) {
			this.renderGraph(this.state.graphInstance, pathwayData);
		}
	}

	// Checks if graph data returned has any nodes
	checkEmptyGraph(pathwayData) {
		if (!isEmpty(pathwayData) && (pathwayData.nodes.length == 0)) {
			return true;
		}
		else {
			return false;
		}
	}

	// Graph rendering is not tracked by React
	renderGraph(cy, cyGraph) {
		this.handleResize();
		// Add listener to take care of resize events
		if (window.addEventListener) {
			window.addEventListener('resize', () => {
				this.handleResize();
			}, true);
		}

		this.state.graphRendered = true;
		cy.startBatch();
		cy.remove('*');
		cy.add(cyGraph);

		var nodePositions = {};
		for (var i = 0; i < cyGraph.nodes.length; i++) {
			var xPos = cyGraph.nodes[i].data.bbox.x;
			var yPos = cyGraph.nodes[i].data.bbox.y;
			nodePositions[cyGraph.nodes[i].data.id] = {
				'x': xPos,
				'y': yPos
			};
		}

		cy.layout({name: 'preset', positions: nodePositions, fit: true, padding: 50});

		var compounds = cy.nodes().filter('$node > node');
		compounds.css('padding-left', 5);
		compounds.css('padding-right', 5);
		compounds.css('padding-top', 5);
		compounds.css('padding-bottom', 5);

		cy.endBatch();
		cy.style().update();
	};

	exportImage() {
		if (!isEmpty(this.state.graphInstance)) {
			var imgString = this.state.graphInstance.png({scale: 10});
			imgString = imgString.substring(imgString.indexOf(",") + 1);
			var blob = base64toBlob(imgString, "image/png");
			saveAs(blob, "Graph" + this.state.graphId + ".png");
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
							<div className="graphMenuItem" onClick={() => this.exportImage()}>
								Download Image
							</div>
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
