import React from 'react';
import queryString from 'query-string';

import {EnrichmentGraph} from './components/';
import make_cytoscape from './cy/';

import {ErrorMessage} from '../common-components/';
import {PathwayCommonsService} from '../../services/';

// View
// Prop Dependencies ::
// - query
// - history
// - logPageView
// - logEvent

export class Paint extends React.Component {
  constructor(props) {
    super(props);
    const query = queryString.parse(props.location.search);
    this.state = {
      query: query,
      cy: make_cytoscape({ headless: true }), // cytoscape mounted after Graph component has mounted
      sbgnText: {},
      name: '',
      datasource: ''
    };

    PathwayCommonsService.query(query.uri, 'SBGN')
      .then(responseText => {
        this.setState({
          sbgnText: responseText
        });
      });

    PathwayCommonsService.query(query.uri, 'json', 'Named/displayName')
      .then(responseObj => {
        this.setState({
          name: responseObj ? responseObj.traverseEntry[0].value.pop() : ''
        });
      });

    PathwayCommonsService.query(query.uri, 'json', 'Entity/dataSource/displayName')
      .then(responseObj => {
        this.setState({
          datasource: responseObj ? responseObj.traverseEntry[0].value.pop() : ''
        });
      });

    props.logPageView( props.history.location );
    props.logEvent({
      category: 'View',
      action: 'view',
      label: query.uri
    });
  }

  componentWillReceiveProps( nextProps ) {
    const locationChanged = nextProps.location !== this.props.location;
    if( locationChanged ){
      this.props.logEvent({
        category: 'View',
        action: 'view',
        label: this.state.query.uri
      });
    }
  }

  render() {
    if(this.state.sbgnText) {
      return(
        <div className='Paint'>
          <EnrichmentGraph cy={this.state.cy} sbgnText={this.state.sbgnText} {...this.props}/>
        </div>
      );
    } else  {
      return (
        <ErrorMessage className="Paint">
          Invalid URI
        </ErrorMessage>
      );
    }
  }
}
