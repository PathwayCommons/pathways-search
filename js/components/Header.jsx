import React from 'react';
import {Col} from 'react-bootstrap';

export class Header extends React.Component {
	getPathTitle(titleString) {
		var lastPath = titleString.substring(titleString.lastIndexOf("/"), titleString.length).replace("/", "");
		return lastPath.charAt(0).toUpperCase() + lastPath.slice(1);
	}

	render() {
		return (
			<div className="Header navbar navbar-inverse clearfix">
				<div className="navbar-brand">
					<a href="/">
						Search
					</a>
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
