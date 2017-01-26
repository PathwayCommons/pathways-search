import React from 'react';
import classNames from 'classnames';

// Summary
// Prop Dependencies ::
// none
export class Summary extends React.Component {
	render() {
		return(
			<div className={classNames("Summary", (this.props.hidden ? "hidden" : ""))}>
				Summary
			</div>
		);
	}
}
