import React from 'react';
import classNames from 'classnames';

// Spinner
// Prop Dependencies ::
// none
export class Spinner extends React.Component {
	render() {
		return (
			<div className={classNames("Spinner", this.props.hidden ? "hidden" : "")}>
				<div className={classNames("sk-cube-grid", this.props.full ? "full" : "")}>
					<div className="sk-cube sk-cube1"></div>
					<div className="sk-cube sk-cube2"></div>
					<div className="sk-cube sk-cube3"></div>
					<div className="sk-cube sk-cube4"></div>
					<div className="sk-cube sk-cube5"></div>
					<div className="sk-cube sk-cube6"></div>
					<div className="sk-cube sk-cube7"></div>
					<div className="sk-cube sk-cube8"></div>
					<div className="sk-cube sk-cube9"></div>
				</div>
			</div>
		);
	}
}
