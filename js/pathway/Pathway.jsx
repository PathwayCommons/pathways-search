import React from 'react';
import {Redirect} from 'react-router-dom';
import {Col, Glyphicon} from 'react-bootstrap';
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
// - query
export class Pathway extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pathwayData: {},
			name: "",
			datasource: "",
			show: false
		};

		get()
			.uri(this.props.query.uri)
			.format("SBGN")
			.fetch()
			.then((responseText) => {
				this.setState({pathwayData: responseText});
			});

		traverse()
			.uri(this.props.query.uri)
			.path("Named/displayName")
			.format("json")
			.fetch()
			.then((responseObject) => {
				this.setState({name: responseObject.traverseEntry[0].value.pop()});
			});

		traverse()
			.uri(this.props.query.uri)
			.path("Entity/dataSource/displayName")
			.format("json")
			.fetch()
			.then(responseObject => responseObject.traverseEntry[0].value.pop())
			.then(dsString => this.setState({datasource: dsString}));
	}

	render() {
		if(this.state.pathwayData) {
			return(
				<div className="Pathway">
					<div className="nameHeader jumbotron clearfix">
						<Col className="header" xs={8} lg={10}>
							<span className="name">{this.state.name}</span>
							<span className="datasource">{this.state.datasource}</span>
						</Col>
						<Col className="tab-button" xs={4} sm={2} lg={1} onClick={() => this.props.graphImage(false)}>
							Screenshot
						</Col>
						<Col className="tab-button" xsHidden sm={2} lg={1} onClick={() => this.setState({active: "Downloads"})}>
							Downloads
						</Col>
					</div>
					<Graph pathwayData={this.state.pathwayData} {...this.props}/>
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
