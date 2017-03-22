import React from 'react';
import {Pagination, Modal, Image} from 'react-bootstrap';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import {search, datasources} from 'pathway-commons';
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
		this.getSearchResult(this.props.query);
	}

	// If query prop or dataSource is changed then re-render
	componentWillReceiveProps(nextProps) {
		if (!isEqual(this.props.query, nextProps.query)) {
			this.getSearchResult(nextProps.query);
		}
	}

	getSearchResult(queryObject) {
		if (!isEmpty(queryObject)) {
			Promise.all([search().query(queryObject).format("json").fetch(), datasources.get()]).then(promArray => {
				var searchData = promArray[0];
				if (searchData) {
					// Process searchData to add extra properties from dataSources
					searchData = {
						searchHit: searchData.searchHit.map((searchResult) => {
							searchResult["sourceInfo"] = promArray[1][searchResult.dataSource[0]];
							return searchResult;
						}),
						...searchData
					};
				}
				this.setState({searchResult: searchData});
			});
		}
	}

	// Handle page switch from Pagination
	handleSelect(e) {
		// Pagination starts numbering from 1 but server starts number from 0, compensate for difference by subtracting 1
		this.props.updateSearchArg({
			...this.props.query,
			page: (e - 1).toString()
		});
		scroll(0, 0);
	}

	render() {
		var searchData = this.state.searchResult;

		// Only load populated searchlist if searchData is populated
		if (!isEmpty(searchData)) {
			var hitList = searchData.searchHit;
			return (
				<div className="SearchList">
					{hitList.map((item, index) => {
						if (item.numParticipants > 3) {
							return (<SearchItem key={index} data={item}/>);
						}
					})}
				</div>
			// If searchData is null this indicates no search results were found
			);
		} else if (searchData === null) {
			return (
				<div className="SearchList">
					<div className="noSearchResults">
						No Search Results Found
					</div>
				</div>
			// Otherwise assume page is still loading and display nothing
			);
		} else {
			return (
				<div className="SearchList">
					<Modal.Dialog>
						<Modal.Body>
							<div className="text">
								<Image src='img/splash_infographic.png' className="splashImage" responsive/>
								Access the entire collection of metabolic pathways, signalling pathways and gene regulatory networks sourced from <a href="http://www.pathwaycommons.org/pc2/datasources">public pathway databases</a>.
							</div>
							<br/>
							<div className="subtext text-right">
								<a href="https://www.ncbi.nlm.nih.gov/pubmed/21071392">Pathway Commons, a web resource for biological pathway data.</a><br/> Cerami E et al. Nucleic Acids Research (2011).
							</div>
						</Modal.Body>
						<Modal.Footer>
							<a href="http://www.pathwaycommons.org/">
								Pathway Commons
							</a>
							{"  |  "}
							<a href="http://groups.google.com/forum/#!forum/pathway-commons-help">
								Help
							</a>
						</Modal.Footer>
					</Modal.Dialog>
				</div>
			);
		}
	}
}
