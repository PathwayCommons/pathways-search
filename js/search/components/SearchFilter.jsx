import React from 'react';
import {FormGroup, InputGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import {map, filter, isEmpty} from 'lodash';
import {BioPaxClass} from "../../helpers/pc2.js";

export class SearchFilter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filterObj: this.props.filter || {}
		}
	}

	componentWillUnmount() {
		this.props.updateFilter(this.state.filterObj);
	}

	updateFilter(index, value) {
		var output = this.state.filterObj;
		if(!isEmpty(value)) {
			output[index] = value;
		}
		else {
			delete output[index];
		}
		this.setState({
			filterObj: output
		});
	}

	render() {
		return(
			<div className="SearchFilter">
				<FormGroup>
					<ControlLabel>
						Class Type
					</ControlLabel>
					<FormControl componentClass="select" defaultValue={this.props.filter.type} onChange={(e) => this.updateFilter("type", e.target.value)}>
						<option value={""}>All</option>
						{BioPaxClass.map((value, index) => {
							return(<option value={value} key={index}>{value}</option>);
						})}
					</FormControl>
					<br/>
					<ControlLabel>
						Data Source
					</ControlLabel>
					<FormControl componentClass="select" defaultValue={this.props.filter.datasource} onChange={(e) =>
							this.updateFilter("datasource", filter(e.target.childNodes, option => option.selected)
							.map((e) => {return e.value}))
					} multiple>
						{map(this.props.dataSources, (value, index) => {
							return(<option value={value.id} key={index}>{value.name}</option>);
						})}
					</FormControl>
				</FormGroup>
			</div>
		);
	}
}
