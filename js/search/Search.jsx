import React from 'react';
import h from 'react-hyperscript';
import {SearchWrapper} from './components/SearchWrapper.jsx';
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
    console.log(props);
    this.props.logPageView( this.props.history.location );
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

  render() {
    return (
      h('div.Search', [
        h(SearchWrapper, {...this.props}, [
          h(SearchHeader),
          h(SearchList)
        ])
      ])
    );
  }
}
