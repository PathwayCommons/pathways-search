import React from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash.isempty';

import {Col, Row, DropdownButton, MenuItem} from 'react-bootstrap';

import convertSbgn from 'sbgnml-to-cytoscape';

import bindEvents from './events';
import {defaultLayout, getDefaultLayout, layoutNames, layoutMap} from './layout/';
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
      graphRendered: false,
      graphEmpty: false,
      width: '100vw',
      height: '85vh',
      layout: defaultLayout,
      availableLayouts: []
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.layout !== this.state.layout && this.state.graphRendered) {
      this.performLayout(nextState.layout, this.props.cy);
    }
  }

  componentWillUnmount() {
    this.props.deleteGlobal('graphImage');
    this.props.cy.destroy();
  }

  componentDidMount() {
    const container = document.getElementById(this.state.graphId);
    this.props.cy.mount(container);
    bindEvents(this.props.cy);
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.checkRenderGraph(nextProps.data);
    return true;
  }

  checkRenderGraph(data) {
    if (!isEmpty(data) && (!this.state.graphRendered)) {
      this.renderGraph(data);
    }
  }

  // Graph rendering is not tracked by React
  renderGraph(sbgnString) {
    const graphJSON = convertSbgn(sbgnString);
    const cy = this.props.cy;

    // Set global graphImage
    this.props.updateGlobal('graphImage', (isFullscreen, cb) => this.exportImage(isFullscreen, cb));

    // Perform render
    cy.remove('*');
    cy.add(graphJSON);

    const layout = getDefaultLayout(cy.nodes().size());

    this.performLayout(layout, graphJSON);

    this.state.layout = layout;

    this.state.availableLayouts = layoutNames(cy.nodes().size());
    this.state.graphRendered = true;
  }

  performLayout(layoutName) {
    const cy = this.props.cy;
    cy.nodes().forEach(ele => {
      ele.removeScratch('_fisheye-pos-before');
    });
    cy.nodes('[class="complex"], [class="complex multimer"]').filter(node => node.isExpanded()).collapse();
    cy.layout(layoutMap.get(layoutName)).run();  
  }

  exportImage(isFullscreen, cb) {
    if (!isEmpty(this.props.cy)) {
      var imgBlob = this.props.cy.png({
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
    const layoutDropdownItems = this.state.availableLayouts.map((layoutName) =>
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
