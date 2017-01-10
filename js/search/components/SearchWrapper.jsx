import React from 'react';
import {isEmpty} from 'lodash';

export class SearchWrapper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filter: {},
		}
	}

	updateFilter(filterObject) {
		if(!isEmpty(filterObject)) {
			this.setState({filter: filterObject});
		}
	}

	updateSearchTerm(searchString) {
		if(searchString != "") {
			this.props.router.push({
				pathname: this.props.location.pathname,
				query: {
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
					filter: this.state.filter
				}))}
			</div>
		);
	}
}
