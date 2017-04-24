import React from 'react';
import classNames from 'classnames';
import {Col, FormGroup, InputGroup, FormControl, Button, Modal} from 'react-bootstrap';
import queryString from 'query-string';
import {hardReload} from '../../App.js';
import {SearchOptions} from './SearchOptions.jsx';
import {HelpTooltip} from './../../components/HelpTooltip.jsx';

// SearchBar
// Prop Dependencies ::
// - query
// - embed
// - updateSearchArg(updateObject)
// - help

// Note: Spread operator used to provide props to SearchOptions, therefore SearchBar also adopts SearchOptions dependencies in addition to those provided above
export class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			q: this.props.query.q || "",
			showFilterMenu: false
		};
	}

	updateTerm() {
		var q = this.state.q.indexOf("%") === -1 ? this.state.q : decodeURIComponent(this.state.q);
		if (q.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)) {
			this.props.history.push({pathname: "/pathway", search: queryString.stringify({uri: q})});
		}
		else if (this.state.q != this.props.query.q) {
			this.props.updateSearchArg({ // Set search and filter parameters to be used when q changes
				q: this.state.q,
				lt: 200,
				gt: 3,
				type: "Pathway",
				enhance: this.props.query.enhance,
				escape: this.props.query.escape
			});
		}
	}

	submit(e) {
		if (e.which == 13) {
			this.updateTerm();
			e.target.blur();
		}
	}

	onChange(e) {
		this.setState({q: e.target.value});
	}

	toggleFilterMenu(state) {
		this.setState({
			showFilterMenu: state != null ? state : !this.state.showFilterMenu
		});
	}

	populateWithExample(e, q) {
		e.stopPropagation();
		this.state.q = q;
		this.updateTerm();
		hardReload();
	}

	render() {
		var showAdvancedButton = this.props.query.q && !this.props.embed;
		return (
			<div className="SearchBar jumbotron clearfix">
				<Col xs={showAdvancedButton ? 9 : 12} md={showAdvancedButton ? 10 : 12}>
					<FormGroup>
						<InputGroup>
							<FormControl type="text" defaultValue={this.props.query.q} placeholder="Search Pathway Commons by URI, pathway name, or gene names" onChange={(e) => this.onChange(e)} onKeyPress={(e) => this.submit(e)}/>
							<InputGroup.Button>
								<Button onClick={() => this.updateTerm()}>Search</Button>
							</InputGroup.Button>
						</InputGroup>
					</FormGroup>
					<HelpTooltip show={this.props.help} title="Search Bar">
						Enter the name of the pathway or gene names. Submit the query by clicking the "Search" button. e.g. 'Signaling by BMP' or 'ACVR2A BMP2 BMPR1B SMAD4'. <span className="clickable" onClick={e => this.populateWithExample(e, "ACVR2A BMP2 BMPR1B SMAD4")}>Click here</span> for an example search query.
					</HelpTooltip>
				</Col>
				<Col xs={3} md={2}>
					<div className={classNames("barItem", showAdvancedButton ? "" : "hidden")} onClick={() => this.toggleFilterMenu(true)}>
						Advanced
					</div>
					<HelpTooltip show={this.props.help && showAdvancedButton} title="Advanced Search">
						This menu provides a way to refine your search results. For example, filter the results by database.
					</HelpTooltip>
				</Col>

				<Modal show={this.state.showFilterMenu} onHide={() => this.toggleFilterMenu(false)}>
					<Modal.Body>
						<SearchOptions {...this.props}/>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => this.toggleFilterMenu(false)}>Close</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}
