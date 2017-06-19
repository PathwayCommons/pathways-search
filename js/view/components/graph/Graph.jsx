import React from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash.isempty';

import {Col, Row, DropdownButton, MenuItem} from 'react-bootstrap';

import convertSbgn from 'sbgnml-to-cytoscape';

import {initGraph} from './init';
import {reduceGraphComplexity} from './complexityReduction';
import {defaultLayout, layoutNames, layoutMap} from './layout';
import {saveAs} from 'file-saver';
import {Spinner} from '../../../components/Spinner.jsx';
import {ErrorMessage} from '../../../components/ErrorMessage.jsx';

// Graph
// Prop Dependencies ::
// - updateGlobal
// - deleteGlobal
// - data
export class Graph extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			graphId: this.props.id || Math.floor(Math.random() * Math.pow(10, 8)) + 1,
			graphContainer: {},
			graphInstance: {},
			graphRendered: false,
			graphEmpty: false,
			width: '100vw',
			height: '85vh',
			layout: defaultLayout
		};
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextState.layout !== this.state.layout) {
			this.performLayout(nextState.layout, this.state.graphInstance);
		}
	}

	componentWillUnmount() {
		this.props.deleteGlobal('graphImage');
		this.state.graphInstance.destroy();
	}

	componentDidMount() {
		const graphContainer = document.getElementById(this.state.graphId);
		const graphInstance = initGraph(graphContainer);

		this.setState({
			graphInstance: graphInstance,
			graphContainer: graphContainer
		});
		this.checkRenderGraph(this.props.data);
	}

	shouldComponentUpdate(nextProps, nextState) {
		this.checkRenderGraph(nextProps.data);
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

	checkRenderGraph(data) {
		if (!isEmpty(data) && (!this.state.graphRendered)) {
			this.renderGraph(data);
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
		this.props.updateGlobal('graphImage', (isFullscreen, cb) => this.exportImage(isFullscreen, cb));

		// Perform render
		this.state.graphRendered = true;
		const graphJSON = convertSbgn(sbgnString);
		this.state.graphInstance.remove('*');
		this.state.graphInstance.add(graphJSON);

		reduceGraphComplexity(this.state.graphInstance);

		this.performLayout(this.state.layout, graphJSON);
	}

	performLayout(layoutName, graphJSON={}, options={}) {
		layoutMap.get(layoutName)(this.state.graphInstance, options);
	}

	exportImage(isFullscreen, cb) {
		if (!isEmpty(this.state.graphInstance)) {
			var imgBlob = this.state.graphInstance.png({
				output: 'blob',
				scale: 5,
				bg: 'white',
				full: Boolean(isFullscreen)
			});
			saveAs(imgBlob, 'Graph' + this.state.graphId + '.png');
		}
		if(cb) {
			cb();
		}
	}

	render() {
		const layoutDropdownItems = layoutNames.map((layoutName) =>
			<MenuItem key={layoutName} onClick={() => this.setState({layout: layoutName})}>
				{layoutName}
			</MenuItem>
		);

		if (!this.state.graphEmpty) {
			return (
				<div className={classNames('Graph', this.props.hidden
					? 'visibilityHidden'
					: '')}>
					<Row>
						<Col xsOffset={1} xs={9} smOffset={2} sm={2}>
							<DropdownButton id="layout" bsStyle="default" pullRight={true} bsSize="large" block title={`Layout | ${this.state.layout}`}>
								{layoutDropdownItems}
							</DropdownButton>
						</Col>
					</Row>
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
				<ErrorMessage className={classNames('Graph', this.props.hidden ? 'visibilityHidden' : '')}>
					No Paths Found
				</ErrorMessage>
			);
		}
	}
}
