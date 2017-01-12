import React from 'react';
import {isEmpty} from 'lodash';
import {parseJSON} from './../../helpers/http.js';

export class SearchWrapper extends React.Component {
	constructor(props) {
		super(props);
	}

	updateFilter(filterObject) {
		if(!isEmpty(filterObject)) {
			this.props.router.push({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					filter: encodeURIComponent(JSON.stringify(filterObject))
				}
			});
		}
	}

	updateSearchTerm(searchString) {
		if(searchString != "") {
			this.props.router.push({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					searchTerm: searchString
				}
			});
		}
	}

	render() {
		return (
			<div className="SearchWrapper">
				{React.Children.map(this.props.children, (child) => React.cloneElement(child, {
					...this.props,
					updateSearchTerm: (searchString) => this.updateSearchTerm(searchString),
					updateFilter: (filterObject) => this.updateFilter(filterObject),
					searchTerm: this.props.location.query.searchTerm,
					filter: parseJSON(decodeURIComponent(this.props.location.query.filter))
				}))}
			</div>
		);
	}
}
