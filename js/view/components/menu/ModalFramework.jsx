import React from 'react';
import {Redirect} from 'react-router-dom';
import {Modal, Button} from 'react-bootstrap';

import {ErrorMessage} from '../../../components/ErrorMessage.jsx';
import {Help} from './Help.jsx';
import {Information} from './Information.jsx';
import {Downloads} from './Downloads.jsx';

// ModalFramework
// Prop Dependencies ::
// - query
export class ModalFramework extends React.Component {
	render() {
		var active = this.props.active || "";
		return (
			<div className="ModalFramework">
				<Modal bsSize="large" show={Boolean(active)} onHide={() => this.props.onHide()}>
					<Modal.Body>
						<Help hidden={"Help" != active} />						
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
