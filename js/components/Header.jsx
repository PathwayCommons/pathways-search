import React from 'react';
import {Link} from 'react-router';
import {hardReload} from '../main.js';

// Header
// Prop Dependencies ::
// none
export class Header extends React.Component {
	getPathTitle(titleString) {
		var lastPath = titleString.substring(titleString.lastIndexOf("/"), titleString.length).replace("/", "");
		return lastPath.charAt(0).toUpperCase() + lastPath.slice(1);
	}

	render() {
		return (
			<div className="Header navbar navbar-inverse clearfix">
				<div className="navbar-brand">
					<Link to={{pathname: "/"}} onClick={() => hardReload()}>
						Search
					</Link>
				</div>
				<div className="navbar-collapse collapse">
					<ul className="nav navbar-nav navbar-right">
						<li>
							<a href="//www.pathwaycommons.org">
								Pathway Commons
							</a>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}
