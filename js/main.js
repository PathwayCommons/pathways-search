import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App.js';

import styles from '!style-loader!css-loader!sass-loader!../styles/main.scss';

console.log("DEVELOPMENT BUILD");
ReactDOM.render(<App/>, document.getElementById('container'));
