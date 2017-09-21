import React from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';

import isEmpty from 'lodash.isempty';

import PathwayCommonsService from '../../services/pathwayCommons/';

// SearchOptions
// Prop Dependencies ::
// - query
// - searchResult
// - updateSearchQuery(query)
export class SearchOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: this.props.query,
      datasources: [],
      queryChanged: false
    };

    const datasources = PathwayCommonsService.core.datasources
      .fetch()
      .then(datasourcesResponse => Object.keys(datasourcesResponse).map(key => datasourcesResponse[key]));

    // get all datasources that returned search results for the current query
    const queryMatchProviders = PathwayCommonsService.querySearch({...this.props.query, datasource: undefined})
      .then(searchResult => searchResult.providers);

    Promise.all([datasources, queryMatchProviders])
      .then(promises => {
        return promises[0].filter(datasource => promises[1].indexOf(datasource.name) !== -1);
      })
      .catch(() => { // Provide all datasources if no datasources available in search results
        return datasources;
      })
      .then(datasources => this.setState({datasources: datasources}));
  }

  // once the options view is closed, update the search query
  componentWillUnmount() {
    const props = this.props;
    const state = this.state;
    const requiredQueryFields = [
      'type',
      'datasource',
      'lt',
      'gt'
    ];

    if (state.queryChanged) {
      const newQueryState = {...state.query};

      // ensure required query fields exist
      requiredQueryFields.forEach(field => {
        if (state.query[field] == null) {
          newQueryState[field] = '';
        }
      });

      this.setState({
        query: newQueryState
      }, props.updateSearchQuery(state.query));
    }
  }

  updateQueryFilter(key, value) {
    const newQueryState = {...this.state.query};

    if(!isEmpty(value)) { // ensure all valid values returns !isEmpty() === true
      newQueryState[key] = value;
      this.setState({
        query: newQueryState,
        [key]: value,
        queryChanged: true
      });
    }
  }

  render() {
    const state = this.state;
    const props = this.props;

    return (
      <div className="SearchOptions">
        <FormGroup>
          <ControlLabel>
            Datasources
          </ControlLabel>
          {
            !isEmpty(state.datasources) ?
            <Typeahead
              multiple
              clearButton
              labelKey="name"
              options={state.datasources}
              defaultSelected={props.query.datasource ?
                state.datasources.filter(datasource => props.query.datasource.indexOf(datasource.name) !== -1) :
                state.datasources}
              placeholder="Select one or more datasources to filter by (eg. Reactome)"
              onChange={selectedArray => this.updateQueryFilter('datasource', selectedArray.map(selected => selected.name))}
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
            defaultValue={state.query.gt ? state.query.gt : undefined}
            onChange={e => this.updateQueryFilter('gt', String(+e.target.value || ''))}
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
            defaultValue={state.query.lt ? state.query.lt : undefined}
            onChange={e => this.updateQueryFilter('lt', String(+e.target.value || ''))}
          />
          <HelpBlock>
            Only search results with less than the number of participants displayed above will be shown. Alternatively, leave blank to disable maximum filtering.
          </HelpBlock>
        </FormGroup>
      </div>
    );
  }
}
