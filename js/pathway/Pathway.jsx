import React from 'react';
import {Redirect} from 'react-router';
import {Nav, NavItem} from 'react-bootstrap';
import convert from 'sbgnml-to-cytoscape';
import {httpGetAsync, getPathwayURL, parseJSON} from './../helpers/http.js';

import {Summary} from './tabs/Summary.jsx';
import {Interactions} from './tabs/Interactions.jsx';
import {Publications} from './tabs/Publications.jsx';
import {Downloads} from './tabs/Downloads.jsx';
import {Graph} from './tabs/Graph.jsx';

export class Pathway extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pathwayData: {}
		}
		httpGetAsync(getPathwayURL(this.props.location.query.uri, "SBGN"), (responseText) => {
			this.updatePathwayData(responseText);
		});
	}

	updatePathwayData(pathwayString) {
		try {
			this.setState({pathwayData: convert(pathwayString)});
		}
		catch(e) {
			console.error(e);
		}
	}

	handleSelect(eventKey) {
		this.props.router.push({
			pathname: this.props.location.pathname,
			query: {
				uri: this.props.location.query.uri,
				active: eventKey
			}
		});
	}

	render() {
		var active = this.props.location.query.active || "Graph";
		if(this.state.pathwayData) {
			return(
				<div className="Pathway">
					<Nav activeKey={active} onSelect={(e) => this.handleSelect(e)} bsStyle="tabs">
						{/*
						<NavItem eventKey="Summary">
							Summary
						</NavItem>
						<NavItem eventKey="Interactions">
							Interactions
						</NavItem>
						<NavItem eventKey="Publications">
							Publications
						</NavItem>
						<NavItem eventKey="Downloads">
							Downloads
						</NavItem>
						<NavItem eventKey="Graph">
							Graph
						</NavItem>
						*/}
					</Nav>
					<Summary hidden={"Summary" != active}/>
					<Interactions hidden={"Interactions" != active}/>
					<Publications hidden={"Publications" != active}/>
					<Downloads hidden={"Downloads" != active}/>
					<Graph hidden={"Graph" != active} pathwayData={this.state.pathwayData}/>
				</div>
			);
		}
		else {
			return(null);
		}
	}
}
