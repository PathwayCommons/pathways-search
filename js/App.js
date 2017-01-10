import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Redirect, hashHistory} from 'react-router';

import {Page} from './components/Page.jsx';
import {Search} from './search/Search.jsx';

export class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Router history={hashHistory}>
				<Route component={Page}>
					<Redirect from="/" to="/search"/>
					<Route path="/search" component={Search}/>
				</Route>
			</Router>
		);
	}
}
