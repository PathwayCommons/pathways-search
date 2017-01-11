import React from 'react';
import classNames from 'classnames';

export class Interactions extends React.Component {
	render() {
		return(
			<div className={classNames("Interactions", (this.props.hidden ? "hidden" : ""))}>
				Interactions
			</div>
		);
	}
}
