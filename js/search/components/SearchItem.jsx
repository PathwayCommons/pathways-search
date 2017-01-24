import React from 'react';
import {Col, Image} from 'react-bootstrap';
import {Link} from 'react-router';

import {getLogoURL} from './../../helpers/http.js';

export class SearchItem extends React.Component {
	render() {
		var data = this.props.data;
		return (
			<div className="SearchItem clearfix">
				<Link to={{pathname: "/pathway", query: {uri: data.uri}}} target="_blank">
					<Col xs={3} className="src-thumbnail-container">
						<div className="src-thumbnail">
							<Image src={getLogoURL(this.props.dataSources, data.dataSource[0])}/>
						</div>
					</Col>
					<Col xs={9}>
						<div className="header">
							<p className="title"><strong>{data.name}</strong></p>
							<p className="uri">{data.name ? "" : data.uri}</p>
						</div>
						<div className="subtext">
							<p>
								<small className="source">Source: <i>{data.sourceInfo.name}</i></small>
							</p>
							<p>
								<small className="class">Class: {data.biopaxClass}</small><br/>
							</p>
							<p>
								<small className="size">{data.size != null ? "Number of Interactions: " + data.size : ""}</small>
							</p>
						</div>
					</Col>
				</Link>
			</div>
		);
	}
}
