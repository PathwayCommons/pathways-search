import React from 'react';
import classNames from 'classnames';
import {Col, FormGroup, InputGroup, FormControl, Button, Modal} from 'react-bootstrap';
import {hardReload} from '../../main.js';
import {SearchOptions} from './SearchOptions.jsx';
import {HelpTooltip} from './../../components/HelpTooltip.jsx';

// SearchBar
// Prop Dependencies ::
// - query
// - updateSearchArg(updateObject)
// - help

// Note: Spread operator used to provide props to SearchOptions, therefore SearchBar also adopts SearchOptions dependencies in addition to those provided above
export class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			q: this.props.query.q || "",
			showFilterMenu: false
		}
	}

	updateTerm() {
		if (this.state.q != this.props.query.q) {
			this.props.updateSearchArg({q: this.state.q, type: "Pathway"});
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
		return (
			<div className="SearchBar jumbotron clearfix">
				<Col xs={9} md={10}>
					<FormGroup>
						<InputGroup>
							<FormControl type="text" defaultValue={this.props.query.q} placeholder="Search Pathway Commons by  pathway name or gene names" onChange={(e) => this.onChange(e)} onKeyPress={(e) => this.submit(e)}/>
							<InputGroup.Button>
								<Button onClick={() => this.updateTerm()}>Search</Button>
							</InputGroup.Button>
						</InputGroup>
					</FormGroup>
					<HelpTooltip show={this.props.help} title="Search Bar">
						Enter the name of the pathway or gene names. Submit the query by clicking the "Search" button. e.g. 'BMP Signalling'. <span className="clickable" onClick={e => this.populateWithExample(e, "BMP Signalling")}>Click here</span> for an example search query.
					</HelpTooltip>
				</Col>
				<Col xs={3} sm={2}>
					<div className={classNames("barItem", this.props.query.q ? "" : "hidden")} onClick={() => this.toggleFilterMenu(true)}>
						Advanced
					</div>
					<HelpTooltip show={this.props.help} title="Search Options">
						This menu provides a way to refine your search results. For example, filter the results by database.
					</HelpTooltip>
				</Col>

				<Modal show={this.state.showFilterMenu} onHide={() => this.toggleFilterMenu(false)}>
					<Modal.Header closeButton>
						<Modal.Title>Advanced Search</Modal.Title>
					</Modal.Header>
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
