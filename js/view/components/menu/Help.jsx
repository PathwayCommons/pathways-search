import React from 'react';
import classNames from 'classnames';
import {traverse} from 'pathway-commons';
import isEmpty from 'lodash/isEmpty';

// Interactions
// Prop Dependencies ::
export class Help extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return(
			<div className={classNames("Help", (this.props.hidden ? "hidden" : ""))}>
				<p>
					This viewer represents cellular processes with symbols that conform to the <a href="http://sbgn.github.io/sbgn/" target="_blank">Systems Biology Graphic Notation (SBGN) standard</a>.
					In particular, we have used SBGN's <a href="http://journal.imbio.de/article.php?aid=263" target="_blank">Process Description (PD) </a> visual language which aims to represent the progression or change of molecular entities from one form to another.
				</p>
			</div>
		);
	}
}
