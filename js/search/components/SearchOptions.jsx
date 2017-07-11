import React from 'react';
import {FormGroup, InputGroup, FormControl, ControlLabel, HelpBlock, Button} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import Toggle from 'react-toggle';
import map from 'lodash.map';
import isEmpty from 'lodash.isempty';
import clone from 'lodash.clone';
import {datasources} from 'pathway-commons';
import {queryFetch} from '../helpers/queryFetch.js';
import {BioPaxClass} from "../../helpers/pc2.js";

// Determines which prop are valid filter props as opposed to other properties like page or query
const filterPropList = [
	"type",
	"datasource",
	"lt",
	"gt",
	"enhance"
]

// SearchOptions
// Prop Dependencies ::
// - query
// - searchResult
// - updateSearchArg(updateObject)
export class SearchOptions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			query: clone(this.props.query),
			datasource: {},
			datasourceRef: [],
			lt: this.props.query.lt || "",
			gt: this.props.query.gt || "",
			enhance: this.props.query.enhance || ""
		};

		Promise.all([
			datasources
				.fetch()
				.then(datasourceObj => Object.keys(datasourceObj).map(key => datasourceObj[key])),
			queryFetch({...this.props.query, datasource: undefined})
		])
			.then(promArray => promArray[0].filter(datasource => promArray[1].providers.indexOf(datasource.name) !== -1))
			.catch(() => { // Provide all datasources if no datasources available in search results
				console.error("No datasources available in search results");
				return datasources
					.fetch()
					.then(datasourceObj => Object.keys(datasourceObj).map(key => datasourceObj[key]));
			})
			.then(datasourceObj => this.setState({datasourceRef: datasourceObj}));
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
		return (
			<div className="SearchOptions">
				<FormGroup>
					<ControlLabel>
						Datasources
					</ControlLabel>
					{
						!isEmpty(this.state.datasourceRef) ?
						<Typeahead
							multiple
							clearButton
							labelKey="name"
							options={this.state.datasourceRef}
							defaultSelected={this.props.query.datasource ?
								this.state.datasourceRef.filter(datasource => this.props.query.datasource.indexOf(datasource.name) !== -1) :
								this.state.datasourceRef}
							placeholder="Select one or more datasources to filter by (eg. Reactome)"
							onChange={selectedArray => this.updateFilter("datasource", selectedArray.map(selected => selected.name))}
						/> : null
					}
					<HelpBlock>
						Only search results from the datasources listed above will be shown. Alternatively, remove all datasources to disable datasource filtering.
					</HelpBlock>
				</FormGroup>
				<FormGroup>
					<ControlLabel>
						Minimum participants
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
						Maximum participants
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
}
