import React from 'react';
import {FormGroup, InputGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import map from 'lodash/map';
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

	render() {
		if(!isEmpty(this.state.datasource)) {
			var defaultArray = this.props.query.datasource ? this.state.datasource.filter(datasource => this.props.query.datasource.indexOf(datasource.id) !== -1) : [];
			return (
				<div className="SearchOptions">
					<FormGroup>
						<ControlLabel>
							Data Source
						</ControlLabel>
						<Typeahead
							multiple
							clearButton
							labelKey="name"
							options={this.state.datasource}
							defaultSelected={defaultArray}
							placeholder="Select datasources ..."
							onChange={(e) => {this.updateFilter("datasource", e.map(e => e.id));console.log(e.map(e => e.id));}}
						/>
					</FormGroup>
				</div>
			);
		}
		else {
			return(
				<div className="SearchOptions"/>
			);
		}
	}
}
