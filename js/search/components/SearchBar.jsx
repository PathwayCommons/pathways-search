import React from 'react';
import {FormGroup, InputGroup, FormControl, Button} from 'react-bootstrap';

export class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchTerm: this.props.searchTerm || ""
		}
	}

	updateTerm() {
		if(this.state.searchTerm != this.props.searchTerm) {
			this.props.updateSearchTerm(this.state.searchTerm);
		}
	}

	submit(e) {
		if(e.which == 13) {
			this.updateTerm();
		}
	}

	onChange(e) {
		this.setState({searchTerm: e.target.value});
	}

	render() {
		return (
			<div className="SearchBar">
				<FormGroup>
					<InputGroup>
						<FormControl type="text" defaultValue={this.props.searchTerm} onChange={(e) => this.onChange(e)} onKeyPress={(e) => this.submit(e)}/>
						<InputGroup.Button>
							<Button>Filters</Button>
						</InputGroup.Button>
					</InputGroup>
				</FormGroup>
			</div>
		);
	}
}
