import React from 'react';
import {SearchHeader} from './components/SearchHeader.jsx';
import {Splash} from '../components/Splash.jsx';

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
        <SearchHeader {...this.props} />
        <Splash/>
      </div>
    );
  }
}