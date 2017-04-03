import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import classNames from 'classnames';
import queryString from 'query-string';

import {Header} from './components/Header.jsx';
import {Faq} from './faq/Faq.jsx';
import {Search} from './search/Search.jsx';
import {Pathway} from './pathway/Pathway.jsx';
import {PageNotFound} from './PageNotFound.jsx';

// Index
// Prop Dependencies ::
// - location
// - match
export class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			help: false,
			...this.handlePropUpdates(this.props)
		};
	}

	// If location.search is changed then re-render
	componentWillReceiveProps(nextProps) {
		if (this.props !== nextProps) {
			this.setState(this.handlePropUpdates(nextProps));
		}
	}

	handlePropUpdates(props) {
		return {
			embed: props.match && props.match.params.modifier === "embed" ? true : false,
			query: queryString.parse(props.location.search)
		};
	}

	updateGlobal(key, value) {
		if(key !== "updateGlobal") {
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
				<div className={classNames("Index", this.state.embed ? "iframe" : "", this.props.className)}>
					<Header hidden={this.state.embed} {...globalObject}/>
					<div className={this.state.embed ? "" : "Content"}>
						<Switch>
							<Route exact path="/" render={() => <Redirect to="/search"/>}/>
							<Route path="/search" render={props => <Search {...props} {...globalObject}/>}/>
							<Route path="/faq" render={props => <Faq {...props} {...globalObject}/>}/>
							<Route path="/pathway" render={props => <Pathway {...props} {...globalObject}/>}/>
							<Route path="*" render={props => <PageNotFound {...props} {...globalObject}/>}/>
						</Switch>
					</div>
				</div>
			);
		}
	}
