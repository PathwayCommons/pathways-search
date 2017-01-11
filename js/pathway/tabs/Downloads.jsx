import React from 'react';
import classNames from 'classnames';

export class Downloads extends React.Component {
	render() {
		return(
			<div className={classNames("Downloads", (this.props.hidden ? "hidden" : ""))}>
				Downloads
			</div>
		);
	}
}
