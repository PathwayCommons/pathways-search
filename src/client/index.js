import React from 'react';
import ReactDOM from 'react-dom';

import {App} from './App';
import {PathwayCommonsService} from './services/';

/* eslint-disable */
// styles need to be imported even though they may not be used in this file
import styles from '!style-loader!css-loader!postcss-loader!../styles/index.css';
/* eslint-enable */

// Set user in pathway-commons
PathwayCommonsService.registerUser('pathways-search');

const mountElement = document.getElementById('container');

ReactDOM.render(<App/>, mountElement);