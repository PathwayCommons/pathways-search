import React from 'react';
import {Col, Image} from 'react-bootstrap';
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
				<Col xs={3} className="src-thumbnail-container">
					<div className="src-thumbnail">
						<Image src={this.state.imageSource}/>
					</div>
				</Col>
				<Col xs={9}>
					<div className="header">
							<Link className="title" to={{pathname: "/pathway", search: queryString.stringify({uri: data.uri})}} target="_blank">
								<strong>{data.name}</strong>
							</Link>
					</div>
					<div className="subtext">
							<span className="source">{data.sourceInfo.name}</span>
							<br/>
							<span className="participants">{(data.numParticipants || "0") + " Participants"}</span>
					</div>
				</Col>
			</div>
		);
	}
}
