import React from 'react';
import isArray from 'lodash.isarray';
import isEqual from 'lodash.isequal';
import queryString from 'query-string';
import {Spinner} from '../../components/Spinner.jsx';

import PathwayCommonsService from '../../services/pathwayCommons/';

// SearchWrapper
// Prop Dependencies ::
// - history
// - location
// - query
export class SearchWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResult: {},
      loading: false
    };
  }

  // If query prop or dataSource is changed then re-render
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.query, nextProps.query)) {
      this.getSearchResult(nextProps.query);
    }
  }

  componentDidMount(){
    this.getSearchResult(this.props.query);
  }

  getSearchResult(query) {
    this.setState({loading: true});
    PathwayCommonsService.querySearch(query)
      .then(searchResult => {
        this.setState({
          searchResult: searchResult,
          loading: false
        });
      });
  }

  updateSearchArg(updateObject) {
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: queryString.stringify(this.filterUpdate(updateObject))
    });

    if(this.props.embed === true) {
      var openUrl = window.location.href.replace('/embed', '');
      window.open(openUrl, 'Pathway Commons Search');
    }
  }

  // Handles updates and changes to the search query
  filterUpdate(updateObject) {
    var output = {};
    for(var property in updateObject) {
      // Use recursion to handle properties that are arrays
      if(isArray(updateObject[property])) {
        output[property] = [];
        Object.assign(output[property], this.filterUpdate(updateObject[property]));
      }
      // If property is not an empty string add it to output object
      else if(updateObject[property] != '') {
        output[property] = updateObject[property];
      }
    }

    return output;
  }

  render() {
    return (
      <div className="SearchWrapper">
        <Spinner full hidden={!this.state.loading} />
        {React.Children.map(this.props.children, (child) => React.cloneElement(child, {
          ...this.props,
          ...this.state,
          updateSearchArg: object => this.updateSearchArg(object)
        }))}
      </div>
    );
  }
}
