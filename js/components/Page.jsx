import React from 'react';
import {Header} from './Header.jsx';
import {Footer} from './Footer.jsx';

export class Page extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={this.props.className}>
				<Header {...this.props}/>
				{this.props.children}
				<Footer {...this.props}/>
			</div>
		);
	}
}
