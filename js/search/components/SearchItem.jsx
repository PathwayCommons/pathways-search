import React from 'react';
import {Col, Image} from 'react-bootstrap';
import {Link} from 'react-router';
import isEqual from 'lodash/isEqual';

import {datasources} from 'pathway-commons';

// SearchList
// This component is only meant to be called by SearchList
// Prop Dependencies ::
// - data
// - dataSources
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
				<Link to={{pathname: "/pathway", query: {uri: data.uri}}} target="_blank">
					<Col xs={3} className="src-thumbnail-container">
						<div className="src-thumbnail">
							<Image src={this.state.imageSource}/>
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
