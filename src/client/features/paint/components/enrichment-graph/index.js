import React from 'react';
import isEmpty from 'lodash.isempty';
import {saveAs} from 'file-saver';

import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
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
      drawerOpen: false,
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

  handleMenuSelect(id, parent) {
    if (id == 'Paint-save') {
      this.exportImage();
    }
  }

  exportImage() {
    const imgBlob = this.props.cy.png({output: 'blob', scale: 3, bg: 'white',full: true});
    saveAs(imgBlob, this.props.name  + '.png');
  }

  handleDrawerToggle() {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    });
  }

  render() {
    if (!this.state.graphEmpty) {
      return (
        <div className='EnrichmentGraph'>
          <div className='Paint-sidenav'>
            <SideNav highlightColor='#ECF0F1' highlightBgColor='#2C3E50' onItemSelection={(id, parent) => this.handleMenuSelect(id, parent)}>
              <a href="http://pathwaycommons.org/">
                <img src='img/pc_logo_dark.svg' className="Painter-logo" alt="logo" />
              </a>
              <h2>Paint</h2>
              <h4>Pathway</h4> <h6> {this.props.name ? this.props.name : ''}</h6>
              <h4>Datasource </h4> <h6>{this.props.datasource}</h6>
              <Nav id='Paint-save' onClick={() => this.exportImage()}>
                  <NavText> Save as image </NavText>
              </Nav>
              <Nav id='Paint-enrichment-data'>
                  <NavText> Enrichment data </NavText>
              </Nav>
            </SideNav>
          </div>
          <div id={this.state.graphId} style={{width: this.state.width, height: this.state.height}}/>

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
