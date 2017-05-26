import React from 'react';
import {Redirect} from 'react-router-dom';
import {Modal, Button} from 'react-bootstrap';

import {ErrorMessage} from '../../components/ErrorMessage.jsx';
import {HelpTooltip} from '../../components/HelpTooltip.jsx';
import {Interactions} from '../tabs/Interactions.jsx';
import {Information} from '../tabs/Information.jsx';
import {Downloads} from '../tabs/Downloads.jsx';

// ModalFramework
// Prop Dependencies ::
// - query
export class ModalFramework extends React.Component {
	render() {
		var active = this.props.active || "";
		return (
			<div className="ModalFramework">
				<Modal show={Boolean(active)} onHide={() => this.props.onHide()}>
					<Modal.Body>
						<Interactions hidden={"Interactions" != active} uri={this.props.query.uri}/>
						<Information hidden={"Information" != active} uri={this.props.query.uri}/>
						<Downloads hidden={"Downloads" != active} uri={this.props.query.uri} name={this.props.name} pathwayData={this.props.pathwayData} graphImage={this.props.graphImage}/>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => this.props.onHide()}>Close</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}
