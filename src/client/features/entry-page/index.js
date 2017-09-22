import React from 'react';

import {Splash, SearchHeader} from './components/';

// landing page for the search app
// props::
// - history
// - location
// - match
// - logPageView
// - logEvent

export class EntryPage extends React.Component {
  render() {
    return (
      <div className='Search'>
        <SearchHeader history={this.props.history} embed={this.props.embed} />
        <Splash/>
      </div>
    );
  }
}