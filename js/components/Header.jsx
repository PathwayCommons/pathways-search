import React from 'react';
import localForage from 'localforage';
import {Link} from 'react-router';
import Toggle from 'react-toggle'
import {hardReload} from '../main.js';

// Header
// Prop Dependencies ::
// none
export class Header extends React.Component {
	constructor(props) {
		super(props);
		localForage.getItem("help").then(state => this.toggleHelp(state || false));
	}

	toggleHelp(boolVal) {
		if(typeof boolVal !== "boolean") {
			boolVal = !this.props.help;
		}
		this.props.updateGlobal("help", boolVal);
		localForage.setItem("help", boolVal);
	}

	getPathTitle(titleString) {
		var lastPath = titleString.substring(titleString.lastIndexOf("/"), titleString.length).replace("/", "");
		return lastPath.charAt(0).toUpperCase() + lastPath.slice(1);
	}

	render() {
		return (this.props.hidden !== true)
			? <div className="Header navbar navbar-inverse clearfix">
					<div className="navbar-brand">
						<Link to={{
							pathname: "/"
						}} onClick={() => hardReload()}>
							Search
						</Link>
					</div>
					<div className="navbar-collapse collapse">
						<ul className="nav navbar-nav navbar-right">
							<li>
								<a onClick={e => this.toggleHelp()}>
									Help
									<Toggle icons={false} checked={this.props.help}/>
								</a>
							</li>
						</ul>
					</div>
				</div>
			: null;
	}
}
