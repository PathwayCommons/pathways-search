import React from 'react';
import classNames from 'classnames';

export class ErrorMessage extends React.Component {
	render() {
		return (
			<div className={classNames("ErrorMessage", this.props.className)}>
				{this.props.children || "Error"}
			</div>
		);
	}
}
