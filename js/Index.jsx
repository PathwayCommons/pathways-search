import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import classNames from 'classnames';
import queryString from 'query-string';
import {utilities} from 'pathway-commons';
import {Alert} from 'react-bootstrap';

import {Search} from './search/Search.jsx';
import {View} from './view/View.jsx';
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
			pcOnline: true,
			...this.handlePropUpdates(this.props)
		};
		this.pcLiveCheck();
	}

	// If location.search is changed then re-render
	componentWillReceiveProps(nextProps) {
		if (this.props !== nextProps) {
			this.setState(this.handlePropUpdates(nextProps));
			this.pcLiveCheck();
		}
	}

	pcLiveCheck() {
		utilities.pcCheck(5000).then(isOnline => this.setState({pcOnline: isOnline}));
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
				<div className={this.state.embed ? "" : "Content"}>
					{
						this.state.pcOnline ? null : (
							<Alert bsStyle="warning">
								<strong>Pathway Commons Offline :</strong> Please try again later
							</Alert>
						)
					}
					<Switch>
						<Route exact path="/" render={() => <Redirect to="/search"/>}/>
						<Route path="/search" render={props => <Search {...props} {...globalObject}/>}/>
						<Route path="/view" render={props => <View {...props} {...globalObject}/>}/>
						<Route path="*" render={props => <PageNotFound {...props} {...globalObject}/>}/>
					</Switch>
				</div>
			</div>
		);
	}
}
