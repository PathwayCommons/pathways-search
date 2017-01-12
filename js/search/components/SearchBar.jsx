import React from 'react';
import {FormGroup, InputGroup, FormControl, Button, Modal} from 'react-bootstrap';
import {SearchFilter} from './SearchFilter.jsx';

export class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchTerm: this.props.searchTerm || "",
			showFilterMenu: false
		}
	}

	updateTerm() {
		if (this.state.searchTerm != this.props.searchTerm) {
			this.props.updateSearchTerm(this.state.searchTerm);
		}
	}

	submit(e) {
		if (e.which == 13) {
			this.updateTerm();
		}
	}

	onChange(e) {
		this.setState({searchTerm: e.target.value});
	}

	toggleFilterMenu(state) {
		this.setState({
			showFilterMenu: state != null ? state : !this.state.showFilterMenu
		});
	}

	render() {
		return (
			<div className="SearchBar">
				<FormGroup>
					<InputGroup>
						<FormControl type="text" defaultValue={this.props.searchTerm} onChange={(e) => this.onChange(e)} onKeyPress={(e) => this.submit(e)}/>
						<InputGroup.Button>
							<Button onClick={() => this.toggleFilterMenu()}>Filter</Button>
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
