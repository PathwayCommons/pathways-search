import React from 'react';
import classNames from 'classnames';
import {Header} from './Header.jsx';

// Page
// Prop Dependencies ::
// - params
export class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			embed: (this.props.params.embed === "embed"),
			help: false
		};
	}

	updateGlobal(key, value) {
		if(key !== "updateGlobal") {
			this.setState({[key] : value});
		}
	}

	getAllGlobals() {
		return this.state;
	}

	render() {
		var globalObject = Object.assign({
			updateGlobal: (key, value) => this.updateGlobal(key, value)
		}, this.getAllGlobals());

		return (
			<div className={classNames("Page", this.state.embed ? "iframe" : "", this.props.className)}>
				<Header hidden={this.state.embed} {...globalObject}/>
				<div className={this.state.embed ? "" : "Content"}>
					{React.Children.map(this.props.children, (child) => React.cloneElement(child, globalObject))}
				</div>
			</div>
		);
	}
}
