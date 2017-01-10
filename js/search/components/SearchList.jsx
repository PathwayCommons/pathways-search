import React from 'react';
import {httpGetAsync, getSearchQueryURL, parseJSON} from './../../helpers/http.js';
import {SearchItem} from './SearchItem.jsx';

export class SearchList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchResult: {}
		}
		this.getSearchResult(this.props.searchTerm);
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.searchTerm != nextProps.searchTerm) {
			this.getSearchResult(nextProps.searchTerm);
		}
	}

	getSearchResult(searchTerm) {
		if(searchTerm) {
			httpGetAsync(getSearchQueryURL(searchTerm), (responseText) => this.updateSearchResult(responseText));
		}
	}

	updateSearchResult(searchResultObj) {
		this.setState({searchResult: parseJSON(searchResultObj)});
	}

	render() {
		var hitList = this.state.searchResult.searchHit || [];
		return (
			<div className="SearchList">
				{hitList.map((item, index) => {
					return <SearchItem key={index} dataSources={this.props.dataSources} data={item}/>;
				})}
			</div>
		);
	}
}
