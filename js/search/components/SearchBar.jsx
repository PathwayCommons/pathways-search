import React from 'react';
import {FormGroup, InputGroup, FormControl, Button, Modal} from 'react-bootstrap';
import {SearchFilter} from './SearchFilter.jsx';

// SearchBar
// Prop Dependencies ::
// - query
// - updateSearchArg(updateObject)

// Note: Spread operator used to provide props to SearchFilter, therefore SearchBar also adopts SearchFilter dependencies in addition to those provided above
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

	render() {
		return (
			<div className="SearchBar jumbotron">
				<FormGroup>
					<InputGroup>
						<FormControl type="text" defaultValue={this.props.query.q} onChange={(e) => this.onChange(e)} onKeyPress={(e) => this.submit(e)}/>
						<InputGroup.Button>
							<Button onClick={() => this.updateTerm()}>Search</Button>
						</InputGroup.Button>
					</InputGroup>
				</FormGroup>

				<Modal show={this.state.showFilterMenu} onHide={() => this.toggleFilterMenu(false)}>
					<Modal.Header closeButton>
						<Modal.Title>Filter Settings</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<SearchFilter {...this.props}/>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => this.toggleFilterMenu(false)}>Close</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}
