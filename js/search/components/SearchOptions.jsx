import React from 'react';
import {FormGroup, InputGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import map from 'lodash/map';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import clone from 'lodash/clone';
import {datasources} from 'pathway-commons';
import {BioPaxClass} from "../../helpers/pc2.js";

// Determines which prop are valid filter props as opposed to other properties like page or query
const filterPropList = [
	"type",
	"datasource"
]

// SearchOptions
// Prop Dependencies ::
// - query
// - dataSources
// - updateSearchArg(updateObject)
export class SearchOptions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			query: clone(this.props.query),
			datasource: {}
		};
		datasources.get().then(datasourceObj => this.setState({datasource: Object.values(datasourceObj)}));
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

	renderFilter() {
		return !isEmpty(this.state.datasource) ? (
			<FormGroup>
				<ControlLabel>
					Data Source
				</ControlLabel>
				<FormControl componentClass="select" defaultValue={this.props.query.datasource} onChange={(e) =>
						this.updateFilter("datasource", filter(e.target.childNodes, option => option.selected)
						.map((e) => {return e.value}))
				} multiple>
					{map(this.state.datasource, (value, index) => {
						return(<option value={value.id} key={index}>{value.name}</option>);
					})}
				</FormControl>
			</FormGroup>
		) : null;
	}

	render() {
		return(
			<div className="SearchOptions">
				{this.renderFilter()}
			</div>
		);
	}
}
