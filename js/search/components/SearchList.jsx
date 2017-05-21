import React from 'react';
import {Pagination, Modal, Image, Media, Button, OverlayTrigger, Popover} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import {SearchItem} from './SearchItem.jsx';
import {Splash} from '../../components/Splash.jsx';
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
		const tip_hit = (
			<Popover className={ !this.props.help ? "hidden" : ""} id="popover-filter" placement="bottom" title="Search Results">
				This shows the top {listCutoff} pathways returned by Pathway Commons. Click on 'More Results' to display the remaining 100 search hits returned. Participants refers to the number of physical entities such as proteins and small molecules.
			</Popover>);

		if(!isEmpty(searchData)) {
			var hitList = searchData.searchHit;
			noResults = hitList.length === 0;
		}

		if (this.props.embed) { // If is embed return nothing
			return null;
		} else if (hitList.length > 0) { // Generate search list if results available
			return (
				<div className="SearchList">
					{
						hitList
						.map((item, index) => <SearchItem key={index} data={item}/>)
						.slice(0, !this.state.expanded ? listCutoff : undefined)
					}
					{
						!this.state.expanded && hitList.length > listCutoff ?
						<div className="moreResults" onClick={() => this.setState({expanded: true})}>
							<OverlayTrigger placement="left" overlay={tip_hit} >
								<Button bsSize="large" block>More Results</Button>
							</OverlayTrigger>
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
				<Splash />
			);
		}
	}
}
