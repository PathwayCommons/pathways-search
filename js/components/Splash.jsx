import React from 'react';
import {Modal, Image, Media} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

// Splash
// Prop Dependencies ::
// - none
export class Splash extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div className="Splash">
				<Modal.Dialog className="splashModal">
					<Modal.Body>
						<p className="lead splashText">
							Signalling pathways, metabolic pathways and gene regulatory networks from <a href="http://www.pathwaycommons.org/pc2/datasources" target="_blank">public pathway databases</a>.
						</p>
						<Image src='img/splash_infographic.svg' className="splashImage" />
					</Modal.Body>
					<Modal.Footer>
						<Media>
							<Media.Body>
				        <Media.Heading>
							 		<span id="pc-link"><a href="http://www.pathwaycommons.org/" target="_blank">Pathway Commons</a></span>
								</Media.Heading>
								<span id="pub-link"><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3013659/" target="_blank">A web resource for biological pathway data.</a></span>
				      </Media.Body>
							<Media.Right>
		        		<img width={48} height={48} src="img/pc_logo_dark.svg" alt="Image" />
				      </Media.Right>
				    </Media>
					</Modal.Footer>
				</Modal.Dialog>
			</div>
		);
	}
}
