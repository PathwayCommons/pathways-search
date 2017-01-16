import React from 'react';
import {isEmpty, isArray} from 'lodash';
import {parseJSON} from './../../helpers/http.js';

export class SearchWrapper extends React.Component {
	constructor(props) {
		super(props);
	}

	updateSearchArg(updateObject) {
		this.props.router.push({
			pathname: this.props.location.pathname,
			query: this.filterUpdate(updateObject)
		});
	}

	filterUpdate(updateObject) {
		var output = {};
		for(var property in updateObject) {
			if(isArray(updateObject[property])) {
				output[property] = [];
				Object.assign(output[property], this.filterUpdate(updateObject[property]));
			}
			else if(updateObject[property] != "") {
				output[property] = updateObject[property];
			}
		}

		if(this.props.location.query.page == output.page) {
			delete output.page;
		}
		return output;
	}

	render() {
		var query = this.props.location.query;
		return (
			<div className="SearchWrapper">
				{React.Children.map(this.props.children, (child) => React.cloneElement(child, {
					...this.props,
					updateSearchArg: (object) => this.updateSearchArg(object),
					query: query,
				}))}
			</div>
		);
	}
}
