import React from 'react';
import classNames from 'classnames';

export class Publications extends React.Component {
	render() {
		return(
			<div className={classNames("Publications", (this.props.hidden ? "hidden" : ""))}>
				Publications
			</div>
		);
	}
}
