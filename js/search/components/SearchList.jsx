import React from 'react';
import {Pagination} from 'react-bootstrap';
import {isEqual, isEmpty} from 'lodash';
import classNames from 'classnames';
import {httpGetAsync, getSearchQueryURL, parseJSON} from './../../helpers/http.js';
import {SearchItem} from './SearchItem.jsx';

export class SearchList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchResult: {}
		}
	}

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

	updateSearchResult(searchResultObj) {
		var searchData = parseJSON(searchResultObj);
		searchData = {
			searchHit: searchData.searchHit.map((searchResult) => {
				searchResult["sourceInfo"] = this.props.dataSources[searchResult.dataSource[0]];
				return searchResult;
			}),
			...searchData
		};
		this.setState({searchResult: searchData});
	}

	handleSelect(e) {
		this.props.updateSearchArg({
			...this.props.query,
			page: (e - 1).toString()
		});
		scroll(0,0);
	}

	render() {
		var searchData = this.state.searchResult;
		var hitList = searchData.searchHit || [];
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
						maxButtons={5}
						activePage={parseInt(this.props.query.page) + 1 || 1}
						onSelect={(e) => this.handleSelect(e)}
					/>
				</div>
			</div>
		);
	}
}
