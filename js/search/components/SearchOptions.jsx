import React from 'react';
import {FormGroup, InputGroup, FormControl, ControlLabel, HelpBlock, Button} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import Toggle from 'react-toggle';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import clone from 'lodash/clone';
import {datasources, search} from 'pathway-commons';
import {BioPaxClass} from "../../helpers/pc2.js";

// Determines which prop are valid filter props as opposed to other properties like page or query
const filterPropList = [
	"type",
	"datasource",
	"lt",
	"gt",
	"enhance",
	"escape"
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
			datasourceRef: [],
			lt: this.props.query.lt || "",
			gt: this.props.query.gt || "",
			enhance: this.props.query.enhance || "",
			escape: this.props.query.escape || ""
		};

		Promise.all([
			datasources
				.fetch()
				.then(datasourceObj => Object.values(datasourceObj)),
			search()
				.query({...this.props.query, datasource: undefined, q: this.props.processedQuery})
				.fetch()
		])
			.then(promArray => promArray[0].filter(datasource => promArray[1].providers.indexOf(datasource.name) !== -1))
			.catch(() => { // Provide all datasources if no datasources available in search results
				return datasources
					.fetch()
					.then(datasourceObj => Object.values(datasourceObj));
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
				<div className="optionsHeader">
					<strong>Filter</strong>
				</div>
				<FormGroup>
					<ControlLabel>
						Datasources:
					</ControlLabel>
					<Typeahead
						multiple
						clearButton
						labelKey="name"
						options={this.state.datasourceRef}
						defaultSelected={this.props.query.datasource && !isEmpty(this.state.datasourceRef) ?
							this.state.datasourceRef.filter(datasource => this.props.query.datasource.indexOf(datasource.name) !== -1) :
							this.state.datasourceRef}
						placeholder="Select one or more datasources to filter by (eg. Reactome)"
						onChange={selectedArray => this.updateFilter("datasource", selectedArray.map(selected => selected.name))}
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
				<div className="optionsHeader">
					<strong>Search Options</strong>
				</div>
				<FormGroup>
					<ControlLabel>
						Enhanced Search:
					</ControlLabel>
					<div onClick={() => this.updateFilter("enhance", this.state.enhance !== "false" ? "false" : "true")}>
						<Toggle checked={this.state.enhance !== "false"}/>
					</div>
					<HelpBlock>
						Toggles advanced search query parsing; a system which attempts to refine search relevance, on or off. More information on what it does and how it works is available in the FAQ.
					</HelpBlock>
				</FormGroup>
				<FormGroup>
					<ControlLabel>
						Lucene Escape Input:
					</ControlLabel>
					<div onClick={() => this.updateFilter("escape", this.state.escape !== "false" ? "false" : "true")}>
						<Toggle checked={this.state.escape !== "false"}/>
					</div>
					<HelpBlock>
						Escapes user input to ensure that any Lucene special characters do not interfere with search. Overridden when search enhance is enabled. Recommend leaving enabled unless you intend to enter Lucene manually.
					</HelpBlock>
				</FormGroup>
			</div>
		);
	}
}
