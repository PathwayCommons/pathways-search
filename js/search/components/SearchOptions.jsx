import React from 'react';
import {FormGroup, InputGroup, FormControl, ControlLabel, HelpBlock, Button} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import clone from 'lodash/clone';
import {datasources, search} from 'pathway-commons';
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
			datasource: {},
			lt: this.props.query.lt || "",
			gt: this.props.query.gt || ""
		};

		Promise.all([
			datasources
				.fetch()
				.then(datasourceObj => Object.values(datasourceObj)),
			search()
				.query({...this.props.query, datasource: undefined})
				.fetch()
		])
			.then(promArray => promArray[0].filter(datasource => promArray[1].providers.indexOf(datasource.name) !== -1))
			.then(datasourceObj => this.setState({datasource: datasourceObj}));
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
		if(!isEmpty(value)) { // ensure all valid values returns !isEmpty() === true
			output[index] = value;
		}
		else {
			delete output[index];
		}
		this.setState({
			filterObj: output,
			[index]: value
		});
	}

	render() {
		if(!isEmpty(this.state.datasource)) {
			var defaultArray = this.props.query.datasource ? this.state.datasource.filter(datasource => this.props.query.datasource.indexOf(datasource.id) !== -1) : this.state.datasource;
			return (
				<div className="SearchOptions">
					<FormGroup>
						<div className="optionsHeader">
							<strong>Filter</strong>
						</div>
						<ControlLabel>
							Datasources:
						</ControlLabel>
						<Typeahead
							multiple
							clearButton
							labelKey="name"
							options={this.state.datasource}
							defaultSelected={defaultArray}
							placeholder="Select one or more datasources to filter by (eg. Reactome)"
							onChange={selectedArray => this.updateFilter("datasource", selectedArray.map(selected => selected.id))}
						/>
						<HelpBlock>
							Only search results from the datasources listed above will be shown. Alternatively, remove all datasources to disable datasource filtering.
						</HelpBlock>
					</FormGroup>
					<FormGroup>
						<ControlLabel>
							Minimum participants:
						</ControlLabel>
						<FormControl
							type="text"
							placeholder="Enter the lowest number of participants shown"
							defaultValue={this.state.gt ? this.state.gt : undefined}
							onChange={e => this.updateFilter("gt", String(+e.target.value || ""))}
						/>
						<HelpBlock>
							Only search results with greater than the number of participants displayed above will be shown. Alternatively, leave blank to disable minimum filtering.
						</HelpBlock>
					</FormGroup>
					<FormGroup>
						<ControlLabel>
							Maximum participants:
						</ControlLabel>
						<FormControl
							type="text"
							placeholder="Enter the highest number of participants shown"
							defaultValue={this.state.lt ? this.state.lt : undefined}
							onChange={e => this.updateFilter("lt", String(+e.target.value || ""))}
						/>
						<HelpBlock>
							Only search results with less than the number of participants displayed above will be shown. Alternatively, leave blank to disable maximum filtering.
						</HelpBlock>
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
