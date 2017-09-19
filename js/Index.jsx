import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import classNames from 'classnames';
import queryString from 'query-string';
import {Alert} from 'react-bootstrap';
import ReactGA from 'react-ga';

import {EntryPage} from './entrypage/EntryPage.jsx';
import {Search} from './search/Search.jsx';
import {View} from './view/View.jsx';
import {PageNotFound} from './PageNotFound.jsx';

import PathwayCommonsService from './services/pathwayCommons/';

// Index
// Prop Dependencies ::
// - location
// - match
export class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pcOnline: true,
      ...this.handlePropUpdates(this.props)
    };
    ReactGA.initialize('UA-43341809-7');
    this.pcLiveCheck();
    this.checkDelay = 5000;
  }

  // If location.search is changed then re-render
  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState(this.handlePropUpdates(nextProps));
      this.pcLiveCheck();
    }
  }

  logPageView( loc ) {
    ReactGA.set( { page: loc.pathname } );
    ReactGA.pageview( loc.pathname );
  }

  logEvent( e ) {
    ReactGA.event( e );
  }

  pcLiveCheck() {
    PathwayCommonsService.isServiceOnline(this.delay)
      .then(isOnline => {
        this.setState({pcOnline: isOnline});
      });
  }

  handlePropUpdates(props) {
    return {
      embed: props.match && props.match.params.modifier === 'embed',
      query: queryString.parse(props.location.search)
    };
  }

  updateGlobal(key, value) {
    if(key !== 'updateGlobal') {
      this.setState({[key] : value});
    }
  }

  deleteGlobal(key) {
    delete this.state[key];
  }

  getAllGlobals() {
    return this.state;
  }

  render() {
    var globalObject = Object.assign({
      updateGlobal: (key, value) => this.updateGlobal(key, value),
      deleteGlobal: (key) => this.deleteGlobal(key)
    }, this.getAllGlobals());

    return (
      <div className={classNames("Index", this.state.embed ? 'iframe' : '', this.props.className)}>
        <div className={this.state.embed ? '' : 'Content'}>
          {
            this.state.pcOnline ? null : (
              <Alert bsStyle="warning">
                <strong>Unable to connect within { this.checkDelay / 1000 } seconds</strong> - continuing to try
              </Alert>
            )
          }
          <Switch>
            <Route exact path="/" render={props => <EntryPage {...props} {...globalObject} logEvent={ this.logEvent} logPageView={ this.logPageView} />}/>
            <Route path="/search" render={props => <Search {...props} {...globalObject} logEvent={ this.logEvent } logPageView={ this.logPageView } />}/>
            <Route path="/view" render={props => <View {...props} {...globalObject} logEvent={ this.logEvent } logPageView={ this.logPageView } />}/>
            <Route path="*" render={props => <PageNotFound {...props} {...globalObject}/>}/>
          </Switch>
        </div>
      </div>
    );
  }
}
