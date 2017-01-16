import React from 'react';
import {FormGroup, InputGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import {map, filter, isEmpty, clone} from 'lodash';
import {BioPaxClass} from "../../helpers/pc2.js";

const filterPropList = [
	"type",
	"datasource"
]

export class SearchFilter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			query: clone(this.props.query)
		}
	}

	componentWillUnmount() {
		map(filterPropList, (prop) => {
			if(this.state.query[prop] == null) {
				this.state.query[prop] = "";
			}
		});
		this.props.updateSearchArg(this.state.query);
	}

	updateFilter(index, value) {
		var output = this.state.query;
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
					<FormControl componentClass="select" defaultValue={this.props.query.type} onChange={(e) => this.updateFilter("type", e.target.value)}>
						<option value={""}>All</option>
						{BioPaxClass.map((value, index) => {
							return(<option value={value} key={index}>{value}</option>);
						})}
					</FormControl>
					<br/>
					<ControlLabel>
						Data Source
					</ControlLabel>
					<FormControl componentClass="select" defaultValue={this.props.query.datasource} onChange={(e) =>
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
