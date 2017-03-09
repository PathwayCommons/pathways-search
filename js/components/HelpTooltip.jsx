import React from 'react';
import classNames from 'classnames';
import {Popover} from 'react-bootstrap';

export class HelpTooltip extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show: this.props.show
		};
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.show !== this.props.show) {
			this.setState({show: nextProps.show});
		}
	}

	tempHide() {
		this.setState({show: false});
	}

	render() {
		return (
			<div className={classNames("HelpTooltip", this.props.className, this.state.show ? "" : "hidden")}>
				<Popover id={this.props.title} title={this.props.title} placement={this.props.placement || "bottom"} positionTop={this.props.positionTop} positionLeft={this.props.positionLeft} onClick={() => {this.tempHide()}}>
					<span className="helpText">
						{this.props.children}
					</span>
				</Popover>
			</div>
		);
	}
}
