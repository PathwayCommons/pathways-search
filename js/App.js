import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route} from 'react-router-dom';
import {utilities} from 'pathway-commons';

import {Index} from './Index.jsx';

/* eslint-disable */
// styles need to be imported even though they may not be used in this file
import styles from '!style-loader!css-loader!postcss-loader!../styles/index.css';
/* eslint-enable */

// Set user in pathway-commons
utilities.user("pathways-search");

const mountElement = document.getElementById('container');

export class App extends React.Component {
  render() {
    return (
      <HashRouter className="App">
        <Route path="/:selector?/:modifier?" component={Index}/>
      </HashRouter>
    );
  }
}

// All comments stripped out during production build
console.log("DEVELOPMENT BUILD");
ReactDOM.render(<App/>, mountElement);

export const hardReload = () => {
  ReactDOM.unmountComponentAtNode(mountElement);
  setTimeout(() => ReactDOM.render(<App/>, mountElement), 1);
};
