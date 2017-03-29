import React from 'react';
import classNames from 'classnames';
import {traverse} from 'pathway-commons';
import isEmpty from 'lodash/isEmpty';

// Interactions
// Prop Dependencies ::
// - uri
export class Interactions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			interactionParticipants: {}
		};

		traverse()
			.uri(this.props.uri)
			.path("Pathway/pathwayComponent:Interaction/participant*/displayName")
			.format("json")
			.fetch()
			.then(responseArray => {
				this.setState({interactionParticipants: responseArray.traverseEntry[0].value});
			});
	}
	render() {
		if(!isEmpty(this.state.interactionParticipants)) {
			return(
				<div className={classNames("Interactions", (this.props.hidden ? "hidden" : ""))}>
					<div className="interactionsHeader">
						List of Interactions and Participants
					</div>
					<ul className="interactionsList">
						{this.state.interactionParticipants.map((item, index) => {
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
			return(
				<div className={classNames("Interactions", (this.props.hidden ? "hidden" : ""))}>
					<div className="interactionsHeader">
						No Interactions
					</div>
				</div>
			);
		}
	}
}
