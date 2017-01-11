import React from 'react';
import classNames from 'classnames';

export class Graph extends React.Component {
	render() {
		return(
			<div className={classNames("Graph", (this.props.hidden ? "hidden" : ""))}>
				Graph
			</div>
		);
	}
}
