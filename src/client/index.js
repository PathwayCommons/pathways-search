require('babel-polyfill');

// const debug = require('./debug');

// if( debug.enabled() ){
//   // debug.init();
// }

// TODO client
// react example

import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route} from 'react-router-dom';

import {Index} from './Index.jsx';
import PathwayCommonsService from './services/pathwayCommons/';

// Set user in pathway-commons
PathwayCommonsService.registerUser('pathways-search');

const mountElement = document.getElementById('container');

class App extends React.Component {
  render() {
    return (
      <HashRouter className="App">
        <Route path="/:selector?/:modifier?" component={Index}/>
      </HashRouter>
    );
  }
}

ReactDOM.render(<App/>, mountElement);