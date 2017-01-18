import React from 'react';
import classNames from 'classnames';
import {isEmpty} from 'lodash';
import SBGNViz from 'tmp-sbgn';
import {Spinner} from '../../components/Spinner.jsx';

export class Graph extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			graphId: this.props.id || Math.floor(Math.random() * Math.pow(10, 8)) + 1,
			graphInstance: {},
			graphRendered: false,
			graphEmpty: false
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
		if(this.checkEmptyGraph(pathwayData)) {
			this.state.graphEmpty = true;
		}
		if(!isEmpty(pathwayData) && (!this.state.graphRendered)) {
			this.renderGraph(this.state.graphInstance, pathwayData);
		}
	}

	checkEmptyGraph(pathwayData) {
		if(!isEmpty(pathwayData) && (pathwayData.nodes.length == 0)) {
			return true;
		}
		else {
			return false;
		}
	}

	renderGraph(cy, cyGraph) {
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
		if(!isEmpty(this.state.graphInstance)) {
			var imgString = this.state.graphInstance.png();
			imgString = (imgString.replace(/^data:image\/[^;]/, 'data:application/octet-stream'));

			var link = document.createElement('a');
			link.download = "Graph" + this.state.graphId + ".png";
			link.href = imgString;
			link.click();
			link.parentNode.removeChild(link);
		}
	}

	render() {
		if(!this.state.graphEmpty) {
			return(
				<div className="Graph">
					<div className="GraphMenu">
						<div className="GraphMenuItem" onClick={() => this.exportImage()}>
							Download Image
						</div>
					</div>
					<div className="SpinnerContainer">
						<Spinner hidden={this.state.graphRendered}/>
					</div>
					<div
						className={this.props.hidden ? "visibilityHidden" : ""}
						id={this.state.graphId}
						style={{width:'100vw', height:'76vh'}}
					/>
				</div>
			);
		}
		else {
			return(
				<div className={"Graph no-data"}>No Paths Found</div>
			);
		}
	}
}
