import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import classNames from 'classnames';
import queryString from 'query-string';
import {Alert} from 'react-bootstrap';
import ReactGA from 'react-ga';

import {EntryPage, Search, View, Paint} from './features';

import {PathwayCommonsService} from './services/';


class PageNotFound extends React.Component {
  render() {
    return(
      <div className="PageNotFound">
        <h1>Page Not Found</h1>
        <p>Sorry, but the page you were trying to view does not exist.</p>
      </div>
    );
  }
}

// Index
// Prop Dependencies ::
// - location
// - match
export class App extends React.Component {
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


  render() {
    return (
      <div className={classNames('Index', this.state.embed ? 'iframe' : '', this.props.className)}>
        <div className={this.state.embed ? '' : 'Content'}>
          {
            this.state.pcOnline ? null : (
              <Alert bsStyle="warning">
                <strong>Unable to connect within { this.checkDelay / 1000 } seconds</strong> - continuing to try
              </Alert>
            )
          }
          <Switch>
            <Route exact path="/" render={props => <EntryPage {...props} logEvent={ this.logEvent} logPageView={ this.logPageView} />}/>
            <Route path="/search" render={props => <Search {...props} logEvent={ this.logEvent } logPageView={ this.logPageView } />}/>
            <Route path="/view" render={props => <View {...props} logEvent={ this.logEvent } logPageView={ this.logPageView } />}/>
            <Route path="/paint" render={props => <Paint {...props} logEvent={ this.logEvent } logPageView={ this.logPageView } />}/>
            <Route path="*" render={props => <PageNotFound {...props}/>}/>
          </Switch>
        </div>
      </div>
    );
  }
}
