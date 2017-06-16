import React from 'react';
import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';
import queryString from 'query-string';
import {search, datasources} from 'pathway-commons';
import {queryFetch} from '../helpers/queryFetch.js';
import {Spinner} from '../../components/Spinner.jsx';

// SearchWrapper
// Prop Dependencies ::
// - history
// - location
// - query
export class SearchWrapper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchResult: {},
			processedQuery: "",
			loading: false
		};
	}

	// If query prop or dataSource is changed then re-render
	componentWillReceiveProps(nextProps) {
		if (!isEqual(this.props.query, nextProps.query)) {
			this.getSearchResult(nextProps.query);
		}
	}

	componentDidMount(){
		this.getSearchResult(this.props.query);
	}

	handleLoading( isLoading ){
		this.setState({loading: isLoading});
	}

	getSearchResult(queryObject) {
		this.handleLoading( true );
		queryFetch(queryObject)
			.then(searchResult => {
				this.setState({
					searchResult: searchResult,
					loading: false
				});
			});
	}

	updateSearchArg(updateObject) {
		this.props.history.push({
			pathname: this.props.location.pathname,
			search: queryString.stringify(this.filterUpdate(updateObject))
		});

		if(this.props.embed === true) {
			var openUrl = window.location.href.replace("/embed", "");
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
		if(this.props.query.page == output.page) {
			delete output.page;
		}
		return output;
	}

	render() {
		return (
			<div className="SearchWrapper">
				<Spinner full hidden={!this.state.loading} />
				{React.Children.map(this.props.children, (child) => React.cloneElement(child, {
					...this.props,
					...this.state,
					updateSearchArg: object => this.updateSearchArg(object)
				}))}
			</div>
		);
	}
}
