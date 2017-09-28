import React from 'react';
import isEmpty from 'lodash.isempty';
import {saveAs} from 'file-saver';

import {Card, CardActions, CardTitle} from 'material-ui/Card';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';


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
      availableLayouts: [],
      enrichmentMapEntires: [],
      drawerOpen: false
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

    const enrichmentMapEntires = Object.entries(
      this.state.enrichmentMapEntires
    ).map((k, v) => {
      return (
        <TableRow>
          <TableRowColumn>
            {k[0]}
          </TableRowColumn>
          <TableRowColumn>
            {k[1]}
          </TableRowColumn>
          <TableRowColumn>class2 value...</TableRowColumn>
          <TableRowColumn>class3 value...</TableRowColumn>
          <TableRowColumn>...</TableRowColumn>
        </TableRow>
      );
    });


    if (!this.state.graphEmpty) {
      return (
        <div className='EnrichmentGraph'>

            <Card className='Paint-card'>
              <a href="http://pathwaycommons.org/">
                <img src='img/pc_logo_dark.svg' className="Paint-logo" alt="logo" />
              </a>
              <h3 className='Paint-title'>Paint</h3>
              <CardTitle className='Paint-pathwayname'>
                <h4>Pathway</h4>
                <div>{this.props.name}</div>
                <h4>Datasource</h4>
                <div>{this.props.datasource}</div>
              </CardTitle>

              <CardActions>
                <FlatButton label='Save Image' onClick={() => this.exportImage()}/>
                <FlatButton label='Enrichment Data' onClick={() => this.handleDrawerToggle()}/>
              </CardActions>
            </Card>
          <Drawer open={this.state.drawerOpen} openSecondary={true} width={'80%'} >
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHeaderColumn>Gene</TableHeaderColumn>
                 <TableHeaderColumn>class 1 value</TableHeaderColumn>
                 <TableHeaderColumn>class 2 value</TableHeaderColumn>
                 <TableHeaderColumn>class 3 value</TableHeaderColumn>
                 <TableHeaderColumn>class 4 value</TableHeaderColumn>
               </TableRow>
             </TableHeader>
             <TableBody>
               {enrichmentMapEntires}
             </TableBody>
           </Table>
           <MenuItem>
             <TextField hintText="search" />
             <FlatButton label="sort by" primary={true} />
             {/* <FlatButton
               label="close"
               secondary={true}
               onTouchTap={this.handleDrawerToggle.bind(this)}
             /> */}
           </MenuItem>
          </Drawer>
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
