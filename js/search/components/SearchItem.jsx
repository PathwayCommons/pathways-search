import React from 'react';
import {Col, Image, Button } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import queryString from 'query-string';

import {datasources} from 'pathway-commons';

// SearchItem
// This component is only meant to be called by SearchList
// Prop Dependencies ::
// - data
export class SearchItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imageSource: ""
		};
		this.updateImage(this.props.data.dataSource[0]);
	}

	// If query prop or dataSource is changed then re-render
	componentWillReceiveProps(nextProps) {
		if (!isEqual(this.props.data, nextProps.data)) {
			this.updateImage(nextProps.data.dataSource[0]);
		}
	}

	updateImage(datasource) {
		datasources.lookupIcon(datasource).then(iconUrl => this.setState({imageSource: iconUrl}));
	}

	render() {
		var data = this.props.data;
		return (
			<div className="SearchItem clearfix">
				<Col sm={3} className="src-thumbnail-container hidden-xs">
					<div className="src-thumbnail">
						<Image src={this.state.imageSource} />
					</div>
				</Col>
				<Col className="metadata-wrapper" xs={12} sm={9}>
					<div className="header">
							<Link to={{pathname: "/pathway", search: queryString.stringify({uri: data.uri})}} target="_blank">
								<span className="title">{data.name}</span>
							</Link>
							{ this.props.extras }
					</div>
					<div className="subtext">
							<span className="source">{data.sourceInfo.name}</span>
							<br/>
							<span className="participants">{(data.numParticipants || "0") + " Participants"} </span>
					</div>
				</Col>
			</div>
		);
	}
}
