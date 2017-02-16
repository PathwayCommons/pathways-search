import React from 'react';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import {parseJSON} from './../../helpers/http.js';

// SearchWrapper
// Prop Dependencies ::
// - router
// - location
export class SearchWrapper extends React.Component {
	updateSearchArg(updateObject) {
		this.props.router.push({
			pathname: this.props.location.pathname,
			query: this.filterUpdate(updateObject)
		});
		if(this.props.embed === true) {
			var openUrl = window.location.href.replace("/" + this.props.params.embed, "");
			window.open(openUrl, "Pathway Commons Search");
		}
	}

	// Handles updates and changes to the search query
	filterUpdate(updateObject) {
		var output = {};
		for(var property in updateObject) {
			// Use recursion to handle properties that are arrays
			if(isArray(updateObject[property])) {
				output[property] = [];
				Object.assign(output[property], this.filterUpdate(updateObject[property]));
			}
			// If property is not an empty string add it to output object
			else if(updateObject[property] != "") {
				output[property] = updateObject[property];
			}
		}

		// If the page property is the same in old and new, assume some other property has changed, therefore delete page property to go back to page 1
		if(this.props.location.query.page == output.page) {
			delete output.page;
		}
		return output;
	}

	render() {
		return (
			<div className="SearchWrapper">
				{React.Children.map(this.props.children, (child) => React.cloneElement(child, {
					...this.props,
					updateSearchArg: (object) => this.updateSearchArg(object),
					query: this.props.location.query
				}))}
			</div>
		);
	}
}
