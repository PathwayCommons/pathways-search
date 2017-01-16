import React from 'react';
import classNames from 'classnames';
import {Header} from './Header.jsx';
import {Footer} from './Footer.jsx';

export class Page extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={classNames("Page", this.props.className)}>
				<Header {...this.props}/>
				<div className="Content">
					{this.props.children}
				</div>
				<Footer {...this.props}/>
			</div>
		);
	}
}
