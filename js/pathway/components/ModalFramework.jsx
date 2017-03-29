import React from 'react';
import {Redirect} from 'react-router';
import {Modal, Button} from 'react-bootstrap';

import {ErrorMessage} from '../../components/ErrorMessage.jsx';
import {HelpTooltip} from '../../components/HelpTooltip.jsx';
import {Summary} from '../tabs/Summary.jsx';
import {Interactions} from '../tabs/Interactions.jsx';
import {Publications} from '../tabs/Publications.jsx';
import {Downloads} from '../tabs/Downloads.jsx';

// ModalFramework
// Prop Dependencies ::
// - None
export class ModalFramework extends React.Component {
	render() {
		var active = this.props.active || "";
		return (
			<div className="ModalFramework">
				<Modal show={Boolean(active)} onHide={() => this.props.onHide()}>
					<Modal.Body>
						<Summary hidden={"Summary" != active}/>
						<Interactions hidden={"Interactions" != active} uri={this.props.location.query.uri}/>
						<Publications hidden={"Publications" != active}/>
						<Downloads hidden={"Downloads" != active} uri={this.props.location.query.uri} name={this.props.name} pathwayData={this.props.pathwayData} graphImage={this.props.graphImage}/>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => this.props.onHide()}>Close</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}
