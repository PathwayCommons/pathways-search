import React from 'react';
import {Redirect} from 'react-router-dom';
import {Col, Glyphicon, Navbar, Nav, NavItem, NavDropdown, MenuItem, OverlayTrigger, Popover} from 'react-bootstrap';
import {get, traverse} from 'pathway-commons';

import {ErrorMessage} from '../components/ErrorMessage.jsx';
import {Graph} from './components/graph/Graph.jsx';
import {ModalFramework} from './components/menu/ModalFramework.jsx';

// View
// Prop Dependencies ::
// - query
// - history
// - logPageView
// - logEvent

export class View extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {},
			name: "",
			datasource: "",
			show: false
		};

		get()
			.uri(this.props.query.uri)
			.format("SBGN")
			.fetch()
			.then(responseText => this.setState({data: responseText}));

		traverse()
			.uri(this.props.query.uri)
			.path("Named/displayName")
			.format("json")
			.fetch()
			.then(responseObject => this.setState({name: responseObject.traverseEntry[0].value.pop()}));

		traverse()
			.uri(this.props.query.uri)
			.path("Entity/dataSource/displayName")
			.format("json")
			.fetch()
			.then(responseObject => this.setState({datasource: responseObject.traverseEntry[0].value.pop()}));

		this.props.logPageView( this.props.history.location );
		this.props.logEvent({
			category: 'View',
			action: 'view',
			label: this.props.query.uri
		});
	}

	render() {
		const tip_help = (
			<Popover className="info-tip hidden-xs" id="popover-help" placement="bottom" title="Help">
				A field guide to interpreting the display.
			</Popover>
		);
		const tip_screenshot = (
			<Popover className="info-tip hidden-xs" id="popover-screenshot" placement="bottom" title="Screenshot">
				Click to download an image (png) of the current view.
			</Popover>
		);
		const tip_downloads = (
			<Popover className="info-tip hidden-xs" id="popover-downloads" placement="bottom" title="Downloads Menu">
				View the different file formats available.
			</Popover>
		);
		const tip_metadata = (
			<Popover className="info-tip hidden-xs" id="popover-metadata" placement="bottom" title="Info">
				Click to see information provided by the original datasource.
			</Popover>
		);

		if(this.state.data) {
			return(
				<div className="View">
					{ !this.props.embed &&
						(<Navbar collapseOnSelect>
							<Navbar.Header>
								<Col xsOffset={1} xs={9} smOffset={0} sm={2}>
									<span className="brand">View</span>
								</Col>
					      <Navbar.Toggle />
							</Navbar.Header>
							<Navbar.Collapse>
								<Nav>
									<NavItem eventKey={1} onClick={() => this.setState({active: "Information"})}>
										<OverlayTrigger delayShow={1000} placement="bottom" overlay={tip_metadata}>
											<div id="metadata">{this.state.name ? this.state.name : this.props.query.uri} | {this.state.datasource}</div>
										</OverlayTrigger>
									</NavItem>
								</Nav>
								<Nav pullRight>
									<NavItem eventKey={1} onClick={() => this.props.graphImage(false)}>
										<Col xsHidden >
											<OverlayTrigger delayShow={1000} placement="bottom" overlay={tip_screenshot}>
												<Glyphicon className="glyph-tip" glyph="picture" />
											</OverlayTrigger>
										</Col>
										<Col smHidden mdHidden lgHidden>
											<span className="navitem-label">Screenshot</span>
										</Col>
									</NavItem>
									<NavItem eventKey={2} onClick={() => this.setState({active: "Downloads"})}>
										<Col xsHidden >
											<OverlayTrigger delayShow={1000} placement="bottom" overlay={tip_downloads}>
												<Glyphicon className="glyph-tip" glyph="download-alt" />
											</OverlayTrigger>
										</Col>
										<Col smHidden mdHidden lgHidden >
											<span className="navitem-label">Downloads</span>
										</Col>
									</NavItem>
									<NavItem eventKey={3} onClick={() => this.setState({active: "Help"})}>
										<Col xsHidden >
											<OverlayTrigger delayShow={1000} placement="bottom" overlay={tip_help}>
												<Glyphicon className="glyph-tip" glyph="question-sign" />
											</OverlayTrigger>
										</Col>
										<Col smHidden mdHidden lgHidden >
											<span className="navitem-label">Help</span>
										</Col>
									</NavItem>
								</Nav>
							</Navbar.Collapse>
						</Navbar>)
					}
					<Graph data={this.state.data} {...this.props}/>
					{/* Menu Modal */}
					<ModalFramework onHide={() => this.setState({active: ""})} {...this.state} {...this.props}/>
				</div>
			);
		}
		else if(this.state.data === null) {
			return (
				<ErrorMessage className="View">
					Invalid URI
				</ErrorMessage>
			);
		}
		else {
			return(null);
		}
	}
}
