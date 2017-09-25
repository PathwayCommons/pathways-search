import React from 'react';
import isEmpty from 'lodash.isempty';

import {Col, Row, DropdownButton, MenuItem} from 'react-bootstrap';

import convertSbgn from 'sbgnml-to-cytoscape';

import {defaultLayout, getDefaultLayout, layoutNames, layoutMap} from './layout/';
import {Spinner, ErrorMessage} from '../../../common-components';

// Graph
// Prop Dependencies ::
// - sbgnText
// - cytoscape
export class EnrichmentGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphId: Math.floor(Math.random() * Math.pow(10, 8)) + 1,
      graphRendered: false,
      graphEmpty: false,
      width: '100vw',
      height: '100vh',
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
    this.props.cy.destroy();
  }

  componentDidMount() {
    const container = document.getElementById(this.state.graphId);
    this.props.cy.mount(container);
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.checkRenderGraph(nextProps.sbgnText);
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

  render() {
    const layoutDropdownItems = this.state.availableLayouts.map((layoutName) =>
      <MenuItem key={layoutName} onClick={() => this.setState({layout: layoutName})}>
        {layoutName}
      </MenuItem>
    );

    if (!this.state.graphEmpty) {
      return (
        <div className='EnrichmentGraph'>
          <Row>
            <Col xsOffset={1} xs={9} smOffset={2} sm={2}>
              <DropdownButton id="layout" bsStyle="default" pullRight={true} bsSize="large" block title={`Layout | ${this.state.layout}`}>
                {layoutDropdownItems}
              </DropdownButton>
            </Col>
          </Row>
          <div id={this.state.graphId} style={{
            width: this.state.width,
            height: this.state.height
          }}/>
          <Spinner hidden={this.state.graphRendered}/>
        </div>
      );
    }
    else {
      return (
        <ErrorMessage className='EnrichmentGraph'>
          No Paths Found
        </ErrorMessage>
      );
    }
  }
}
