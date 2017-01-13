import React from 'react';
import classNames from 'classnames';
import {isEmpty} from 'lodash';
import SBGNViz from 'tmp-sbgn';

export class Graph extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			graphId: this.props.id || Math.floor(Math.random() * Math.pow(10, 8)) + 1,
			graphInstance: {},
			graphRendered: false
		}
	}

	componentDidMount() {
		let sbgnViz = new SBGNViz({container: document.getElementById(this.state.graphId)});
		this.setState({graphInstance: sbgnViz});
		this.checkRenderGraph(this.props.pathwayData)
	}

	shouldComponentUpdate(nextProps, nextState) {
		this.checkRenderGraph(nextProps.pathwayData);
		return true;
	}

	checkRenderGraph(pathwayData) {
		if(!isEmpty(pathwayData) && (!this.state.graphRendered)) {
			this.setState({graphRendered: true});
			this.renderGraph(this.state.graphInstance, pathwayData);
		}
	}

	renderGraph(cy, cyGraph) {
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

	render() {
		return (
			<div
				className={classNames("Graph", (this.props.hidden ? "visibilityHidden" : ""))}
				id={this.state.graphId}
				style={{width:'100vw', height:'75vh'}}
			/>
		);
	}
}
