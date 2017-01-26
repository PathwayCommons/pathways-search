import React from 'react';
import classNames from 'classnames';
import {httpGetAsync, getTraversalURL, parseJSON} from '../../helpers/http.js';
import {isEmpty} from 'lodash';

export class Interactions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			interactionParticipants: {}
		}

		var urlInteraction = {
			uri: this.props.uri,
			path: "Pathway/pathwayComponent:Interaction/participant*/displayName"
		};
		httpGetAsync(getTraversalURL(urlInteraction), (responseText) => {
			if(responseText !== null) {
				this.setState({interactionParticipants: parseJSON(responseText).traverseEntry[0].value});
			}
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
