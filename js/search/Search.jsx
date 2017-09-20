import React from 'react';

import queryString from 'query-string';
import extend from 'extend';

import {SearchHeader} from './components/SearchHeader.jsx';
import {SearchList} from './components/SearchList.jsx';

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

    const queryDefaults = {
      q: '',
      lt: 250,
      gt: 3,
      type: 'Pathway'
    };

    const query = extend({}, queryDefaults, queryString.parse(this.props.location.search));

    this.state = {
      query: query
    };
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
  }

  updateSearchQuery(query) {
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: queryString.stringify(query)
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
        <SearchHeader
          {...props}
          {...state}
          updateSearchQuery={query => this.updateSearchQuery(query)}/>

        <SearchList query={this.state.query} embed={this.props.embed}/>
      </div>
    );
  }
}
