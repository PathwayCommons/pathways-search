import React from 'react';
import classNames from 'classnames';
import localForage from 'localforage';
import {
	Grid, Row, Col,
	Glyphicon,
	ControlLabel, Form, FormGroup, InputGroup, FormControl,
	Modal,
	OverlayTrigger, Tooltip, Popover,
	ButtonToolbar, ButtonGroup, Button
} from 'react-bootstrap';
import Toggle from 'react-toggle'
import {Link} from 'react-router-dom';
import queryString from 'query-string';
import {hardReload} from '../../App.js';
import {SearchOptions} from './SearchOptions.jsx';

// SearchHeader
// Prop Dependencies ::
// - query
// - embed
// - updateSearchArg(updateObject)

// Note: Spread operator used to provide props to SearchOptions, therefore SearchBar also adopts SearchOptions dependencies in addition to those provided above
export class SearchHeader extends React.Component {
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
				lt: 250,
				gt: 3,
				type: "Pathway",
				enhance: this.props.query.enhance
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
		const tip_filter = (
			<Popover className="info-tip" id="popover-filter" placement="bottom" title="Filter">
				Refine search results by number of participants or data provider.
			</Popover>
		);
		
		const form_search = (
			<FormControl
				type="text"
				placeholder="Search pathways by name, gene names or type a URI"
				defaultValue={this.props.query.q}
				onChange={(e) => this.onChange(e)} onKeyPress={(e) => this.submit(e)} />
		);

		var showAdvancedButton = this.props.query.q && !this.props.embed;
		return (
			<div className="SearchHeader">
				<Grid>
					<Row>
						<Form horizontal>
							{ !this.props.embed &&
							<div>
								<Col xsOffset={3} xs={5} smOffset={0} sm={2} componentClass={ControlLabel}>
									<Link to={{ pathname: "/" }} onClick={() => hardReload()}>
										<span className="brand">Search</span>
									</Link>
								</Col>
								<Col xs={4} sm={2} smPush={8}>
									<Button>
										<Link to="/faq">
											<Glyphicon glyph="question-sign" />
										</Link>
									</Button>
								</Col>
							</div>
						 	}
				     	<Col xs={12}
								sm={!this.props.embed ? 8 : 12}
								smPull={!this.props.embed ? 2 : 0} >
								<FormGroup controlId="formHorizontalEmail">
									{ showAdvancedButton ?
										(<InputGroup>
											{form_search}
											<InputGroup.Addon>
												<OverlayTrigger delayShow={1000} placement="left" overlay={tip_filter}>
													<Glyphicon
														glyph="filter"
														onClick={() => this.toggleFilterMenu(true)}/>
											 	</OverlayTrigger>
							        </InputGroup.Addon>
										</InputGroup>)
										:
										form_search
									}
								</FormGroup>
				      </Col>
						</Form>
					</Row>
				</Grid>
				<Modal show={this.state.showFilterMenu} onHide={() => this.toggleFilterMenu(false)}>
					<Modal.Header>
						<h4 className="text-center">Filter Options</h4>
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
