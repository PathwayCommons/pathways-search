import React from 'react';
import {Redirect} from 'react-router';
import {Col, Glyphicon} from 'react-bootstrap';
import convert from 'sbgnml-to-cytoscape';
import {get, traverse} from 'pathway-commons';

import {ErrorMessage} from '../components/ErrorMessage.jsx';
import {HelpTooltip} from '../components/HelpTooltip.jsx';
import {Summary} from './tabs/Summary.jsx';
import {Interactions} from './tabs/Interactions.jsx';
import {Publications} from './tabs/Publications.jsx';
import {Downloads} from './tabs/Downloads.jsx';
import {Graph} from './tabs/Graph.jsx';
import {ModalFramework} from './components/ModalFramework.jsx';

// Pathway
// Prop Dependencies ::
// - router
// - location
export class Pathway extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pathwayData: {},
			name: "",
			show: false
		}

		get()
			.uri(this.props.location.query.uri)
			.format("SBGN")
			.fetch()
			.then((responseText) => {
				this.updatePathwayData(responseText);
			});

		traverse()
			.uri(this.props.location.query.uri)
			.path("Named/displayName")
			.format("json")
			.fetch()
			.then((responseObject) => {
				this.setState({name: responseObject.traverseEntry[0].value.pop()});
			});
	}

	updatePathwayData(pathwayString) {
		try {
			pathwayString = convert(pathwayString);
		}
		catch(e) {
			pathwayString = null;
		}
		this.setState({pathwayData: pathwayString});
	}

	render() {
		if(this.state.pathwayData) {
			return(
				<div className="Pathway">
					<div className="nameHeader jumbotron clearfix">
						<Col className="name" xs={10}>
							{this.state.name}
						</Col>
						<Col className="tab-button" xs={2} onClick={() => this.setState({active: "Downloads"})}>
							Downloads
						</Col>
					</div>
					<Graph pathwayData={this.state.pathwayData}/>
					{/* Menu Modal */}
					<ModalFramework onHide={() => this.setState({active: ""})} {...this.state} {...this.props}/>
				</div>
			);
		}
		else if(this.state.pathwayData === null) {
			return (
				<ErrorMessage className="Pathway">
					Invalid URI
				</ErrorMessage>
			);
		}
		else {
			return(null);
		}
	}
}
