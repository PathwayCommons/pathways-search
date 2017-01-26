import React from 'react';
import classNames from 'classnames';
import {Header} from './Header.jsx';
import {Footer} from './Footer.jsx';

// Page
// Prop Dependencies ::
// none
export class Page extends React.Component {
	render() {
		return (
			<div className={classNames("Page", this.props.className)}>
				<Header/>
				<div className="Content">
					{this.props.children}
				</div>
				<Footer/>
			</div>
		);
	}
}
