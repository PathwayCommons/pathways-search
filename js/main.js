import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App.js';

import styles from '!style-loader!css-loader!postcss-loader!../styles/index.css';

// All comments stripped out during production build
console.log("DEVELOPMENT BUILD");
ReactDOM.render(<App/>, document.getElementById('container'));
