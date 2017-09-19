import React from 'react';

import isEqual from 'lodash.isequal';
import queryString from 'query-string';

import {Spinner} from '../components/Spinner.jsx';

import {SearchHeader} from './components/SearchHeader.jsx';
import {SearchList} from './components/SearchList.jsx';


import PathwayCommonsService from '../services/pathwayCommons/';


// Search
// Prop Dependencies ::
// - history
// - logPageView
// - logEvent

// Note: Spread operator used to provide props to SearchWrapper, therefore Search also adopts SearchWrapper dependencies in addition to those provided above
export class Search extends React.Component {
  constructor(props) {
    super(props);
    this.props.logPageView( this.props.history.location );

    this.state = {
      searchResult: {},
      loading: false
    };
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

  componentDidMount(){
    this.getSearchResult(this.props.query);
  }

  componentWillReceiveProps( nextProps ) {
    const locationChanged = nextProps.location !== this.props.location;
    if( locationChanged ){
      this.props.logEvent({
        category: 'Search',
        action: 'query',
        label: nextProps.location.search
      });
    }

    if (!isEqual(this.props.query, nextProps.query)) {
      this.getSearchResult(nextProps.query);
    }
  }

  updateSearchQuery(updateObject) {
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: queryString.stringify(updateObject)
    });

    if(this.props.embed === true) {
      var openUrl = window.location.href.replace('/embed', '');
      window.open(openUrl, 'Pathway Commons Search');
    }
  }


  render() {
    const props = this.props;
    const state = this.state;
    return (
      <div className="Search">
        <Spinner full hidden={!this.state.loading}  />
          <SearchHeader
            {...props}
            {...state}
            updateSearchQuery={query => this.updateSearchQuery(query)}/>

          <SearchList
            {...props}
            {...state}
            updateSearchQuery={query => this.updateSearchQuery(query)}/>
      </div>
    );
  }
}
