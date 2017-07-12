import React from 'react';
import {Pagination, Modal, Media, Button, Glyphicon, OverlayTrigger, Popover} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import isEmpty from 'lodash.isempty';
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
			<Popover className="info-tip" id="popover-hit" placement="bottom" title="Search Hit">
				Shown are each pathway's 'display name' and the original data source. 'Participants' refers to the number of physical entities including proteins and small molecules.
			</Popover>
		);

		const tip_more_results = (
			<Popover className="info-tip" id="popover-more-results" placement="bottom" title="More Results">
				By default the top 5 pathways are displayed. Click to display up to 100 of the remaining search hits.
			</Popover>
		);

		if(!isEmpty(searchData)) {
			hitList = searchData.searchHit;
			noResults = hitList.length === 0;
		}

		if (this.props.embed) { // If is embed return nothing
			return null;
		} else if (hitList.length > 0) { // Generate search list if results available
			return (
				<div className="SearchList">
					{
						hitList
						.map((item, index) => { return index === 0 ?
							(<SearchItem key={index} data={item} extras={(<span>{'        '}<OverlayTrigger placement="bottom" overlay={tip_hit} >
								<Glyphicon className="glyph-tip" glyph="info-sign" /></OverlayTrigger></span>)} />) :
							(<SearchItem key={index} data={item} />);
						})
						.slice(0, !this.state.expanded ? listCutoff : undefined)
					}
					{
						!this.state.expanded && hitList.length > listCutoff ?
						<div className="moreResults" onClick={() => this.setState({expanded: true})}>
							<OverlayTrigger delayShow={1000} placement="top" overlay={tip_more_results} >
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
