import React from 'react';
import {Col} from 'react-bootstrap';

export class Header extends React.Component {
	getPathTitle(titleString) {
		var lastPath = titleString.substring(titleString.lastIndexOf("/"), titleString.length).replace("/", "");
		return lastPath.charAt(0).toUpperCase() + lastPath.slice(1);
	}

	render() {
		return (
			<div className="Header clearfix">
				<Col xs={3} className="title">
					{this.getPathTitle(this.props.location.pathname)}
				</Col>
				<Col xs={6} className="subtitle pull-right">
					Pathway Commons
					<br/>
					Access Point
				</Col>
			</div>
		);
	}
}
