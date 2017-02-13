import React from 'react';
import {Pagination} from 'react-bootstrap';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import {httpGetAsync, getSearchQueryURL, parseJSON} from './../../helpers/http.js';
import {SearchItem} from './SearchItem.jsx';

// SearchList
// Prop Dependencies ::
// - query
// - dataSources
// - updateSearchArg(updateObject)
export class SearchList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchResult: {}
		}
	}

	// If query prop or dataSource is changed then re-render
	componentWillReceiveProps(nextProps) {
		if((!isEqual(this.props.query, nextProps.query) && (!isEmpty(this.props.dataSources))) || (isEmpty(this.props.dataSources) && !isEmpty(nextProps.dataSources))) {
			this.getSearchResult(nextProps.query);
		}
	}

	getSearchResult(query) {
		if(!isEmpty(query)) {
			httpGetAsync(getSearchQueryURL(query), (responseText) =>
				this.updateSearchResult(responseText));
		}
	}

	// Handle JSON string returned from search request
	updateSearchResult(searchResultObj) {
		var searchData = parseJSON(searchResultObj);
		if(searchData) {
			// Process searchData to add extra properties from dataSources
			searchData = {
				searchHit: searchData.searchHit.map((searchResult) => {
					searchResult["sourceInfo"] = this.props.dataSources[searchResult.dataSource[0]];
					return searchResult;
				}),
				...searchData
			};
		}
		this.setState({searchResult: searchData});
	}

	// Handle page switch from Pagination
	handleSelect(e) {
		// Pagination starts numbering from 1 but server starts number from 0, compensate for difference by subtracting 1
		this.props.updateSearchArg({
			...this.props.query,
			page: (e - 1).toString()
		});
		scroll(0,0);
	}

	render() {
		var searchData = this.state.searchResult;

		// Only load populated searchlist if searchData is populated
		if(!isEmpty(searchData)) {
			var hitList = searchData.searchHit;
			return (
				<div className="SearchList">
					{hitList.map((item, index) => {
						if(item.size > 0) {
							return(<SearchItem key={index} dataSources={this.props.dataSources} data={item}/>);
						}
					})}
					<div className={classNames("paginationContainer", "text-center", hitList.length == 0 ? "hidden" : "")}>
						<Pagination
							first
							last
							ellipsis
							boundaryLinks
							items={Math.ceil(searchData.numHits / searchData.maxHitsPerPage)}
							maxButtons={3}
							activePage={parseInt(this.props.query.page) + 1 || 1}
							onSelect={(e) => this.handleSelect(e)}
						/>
					</div>
				</div>
			);
		}
		// If searchData is null this indicates no search results were found
		else if(searchData === null) {
			return (
				<div className="SearchList">
					<div className="noSearchResults">
						No Search Results Found
					</div>
				</div>
			);
		}
		// Otherwise assume page is still loading and display nothing
		else {
			return null;
		}
	}
}
