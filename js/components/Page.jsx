import React from 'react';
import classNames from 'classnames';
import {Header} from './Header.jsx';
import {Footer} from './Footer.jsx';

// Page
// Prop Dependencies ::
// - params
export class Page extends React.Component {
	render() {
		var embedBahaviour = (this.props.params.embed === "embed");
		return (
			<div className={classNames("Page", embedBahaviour ? "iframe" : "", this.props.className)}>
				<Header hidden={embedBahaviour}/>
				<div className={embedBahaviour ? "" : "Content"}>
					{this.props.children}
				</div>
				<Footer hidden={embedBahaviour}/>
			</div>
		);
	}
}
