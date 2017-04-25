import React from 'react';
import {Panel} from 'react-bootstrap';

// FaqEntry
// Prop Dependencies ::
// header
export class FaqEntry extends React.Component {
	render() {
		return (
			<Panel className={this.props.className} header={this.props.header}>
				{this.props.children}
			</Panel>
		);
	}
}
