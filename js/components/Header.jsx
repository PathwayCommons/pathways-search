import React from 'react';
import localForage from 'localforage';
import {Link} from 'react-router-dom';
import Toggle from 'react-toggle'
import {hardReload} from '../App.js';
import {HelpTooltip} from './HelpTooltip.jsx';

// Header
// Prop Dependencies ::
// help
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
							<img className="headerIcon" src="img/pc_logo_light.svg"/>
							Pathway Commons
						</Link>
					</div>
					<div className="navbar-collapse collapse">
						<ul className="nav navbar-nav navbar-right">
							<li>
								<a className="helpButton" onClick={e => this.toggleHelp()}>
									Tips
									<Toggle icons={false} checked={this.props.help}/>
								</a>
								<HelpTooltip show={this.props.help} title="Tips Switch">
									Toggle tips on or off. Click on individual tips to close.
								</HelpTooltip>
							</li>
						</ul>
					</div>
				</div>
			: null;
	}
}
