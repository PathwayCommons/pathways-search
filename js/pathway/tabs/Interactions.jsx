import React from 'react';
import classNames from 'classnames';
import {isEmpty} from 'lodash';

export class Interactions extends React.Component {
	render() {
		if(!isEmpty(this.props.interactionParticipants)) {
			return(
				<div className={classNames("Interactions", (this.props.hidden ? "hidden" : ""))}>
					<div className="interactionsHeader">
						List of Interactions and Participants
					</div>
					<ul className="interactionsList">
						{this.props.interactionParticipants.map((item, index) => {
							return(
								<li key={index}>
									{item}
								</li>
							);
						})}
					</ul>
				</div>
			);
		}
		else {
			return null;
		}
	}
}
