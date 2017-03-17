import React from 'react';
import {Redirect} from 'react-router';
import {Nav, NavItem, Modal, Button} from 'react-bootstrap';

import {ErrorMessage} from '../../components/ErrorMessage.jsx';
import {HelpTooltip} from '../../components/HelpTooltip.jsx';
import {Summary} from '../tabs/Summary.jsx';
import {Interactions} from '../tabs/Interactions.jsx';
import {Publications} from '../tabs/Publications.jsx';
import {Downloads} from '../tabs/Downloads.jsx';

// Pathway
// Prop Dependencies ::
// - router
// - location
export class PathwayMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: "Downloads"
		}
	}

	render() {
		var active = this.state.active;
		return(
			<div className="PathwayMenu">
				<Modal show={this.props.show} onHide={() => this.props.onHide()}>
					<Modal.Body>
						<Nav activeKey={active} onSelect={(key) => this.setState({active: key})} bsStyle="tabs">
							{/*
							<NavItem eventKey="Summary">
								Summary
							</NavItem>
							<NavItem eventKey="Publications">
								Publications
							</NavItem>
							*/}
							<NavItem eventKey="Downloads">
								Downloads
							</NavItem>
							<NavItem eventKey="Interactions">
								Interactions
							</NavItem>
						</Nav>
						<Summary hidden={"Summary" != active}/>
						<Interactions hidden={"Interactions" != active} uri={this.props.location.query.uri}/>
						<Publications hidden={"Publications" != active}/>
						<Downloads hidden={"Downloads" != active} uri={this.props.location.query.uri} name={this.props.name} pathwayData={this.props.pathwayData}/>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => this.toggleMenu(false)}>Close</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}
