import React from 'react';
import {Col, Image} from 'react-bootstrap';

import {getLogoURL} from './../../helpers/http.js';

export class SearchItem extends React.Component {
	render() {
		var data = this.props.data;
		return (
			<div className="SearchItem clearfix">
				<Col xs={3} className="src-thumbnail-container">
					<div className="src-thumbnail">
						<Image src={getLogoURL(this.props.dataSources, data.dataSource[0])}/>
					</div>
				</Col>
				<Col xs={9}>
					<div className="header">
						<div className="title">{data.name}</div>
						<div className="uri">{data.uri}</div>
					</div>
					<div className="subtext">
						<div className="size">Number of Interactions: {data.size}</div>
						<div className="class">Class: {data.biopaxClass}</div>
					</div>
				</Col>
			</div>
		);
	}
}
