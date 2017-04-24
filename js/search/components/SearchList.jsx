import React from 'react';
import {Pagination, Modal, Image} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import {SearchItem} from './SearchItem.jsx';
import {HelpTooltip} from '../../components/HelpTooltip.jsx';
import {ErrorMessage} from '../../components/ErrorMessage.jsx';

// SearchList
// Prop Dependencies ::
// - searchResult
// - embed
// - updateSearchArg(updateObject)
export class SearchList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false
		};
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
		var searchData = this.props.searchResult;
		var hitList = [];
		var noResults = null;
		var listCutoff = 5;

		if(!isEmpty(searchData)) {
			var hitList = searchData.searchHit;
			noResults = hitList.length === 0;
		}

		if (this.props.embed) { // If is embed return nothing
			return null;
		} else if (hitList.length > 0) { // Generate search list if results available
			return (
				<div className="SearchList">
					<HelpTooltip show={this.props.help} title="Search Results" placement="left" positionTop="180px">
						This shows the top {listCutoff} pathways returned by Pathway Commons. Click on 'Show more results' to display the remaining 100 search hits returned. Participants refers to the number of physical entities such as proteins and small molecules
					</HelpTooltip>
					{
						hitList
						.map((item, index) => <SearchItem key={index} data={item}/>)
						.slice(0, !this.state.expanded ? listCutoff : undefined)
					}
					{
						!this.state.expanded && hitList.length > listCutoff ?
						<div className="moreResults" onClick={() => this.setState({expanded: true})}>
							Show More Results ...
						</div>
						: null
					}
				</div>
			);
		} else if (searchData === null || noResults) { // For <= v.8, if searchData is null this indicates no search results found. Else for >= v.9, hitList = [] and empty = true indicates no search results found.
			return (
					<ErrorMessage className="SearchList">
						No Search Results Found
					</ErrorMessage>
			);
		} else {
			// Assume, either on home page or search results not loaded, generate splash screen
			return (
				<div className="SearchList">
					<Modal.Dialog className="splashModal">
						<Modal.Body>
							<h6 className="text-center">
								Search <a href="http://www.pathwaycommons.org/">Pathway Commons</a>
							</h6>
							<div className="text">
								<Image src='img/splash_infographic.svg' className="splashImage" responsive/>
								Access the entire collection of metabolic pathways, signalling pathways and gene regulatory networks sourced from  <a href="http://www.pathwaycommons.org/pc2/datasources">public pathway databases</a>.
							</div>
							<br/>
							<div className="subtext text-right">
								<a href="https://www.ncbi.nlm.nih.gov/pubmed/21071392">Pathway Commons, a web resource for biological pathway data.</a><br/> Cerami E et al. Nucleic Acids Research (2011).
							</div>
						</Modal.Body>
						<Modal.Footer>
							<Link to="/faq">
								FAQ
							</Link>
							{"  |  "}
							<a href="https://groups.google.com/forum/#!forum/pathway-commons-help/">
								Help
							</a>
						</Modal.Footer>
					</Modal.Dialog>
				</div>
			);
		}
	}
}
