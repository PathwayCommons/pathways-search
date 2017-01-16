import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Redirect, hashHistory} from 'react-router';

import {Page} from './components/Page.jsx';
import {Search} from './search/Search.jsx';
import {Pathway} from './pathway/Pathway.jsx';
import {PageNotFound} from './PageNotFound.jsx';

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
					<Route path="/pathway" component={Pathway}/>
				</Route>
				<Route path="/*" component={PageNotFound}/>
			</Router>
		);
	}
}
