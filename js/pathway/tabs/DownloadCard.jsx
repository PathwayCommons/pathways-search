import React from 'react';
import {Col, Button} from 'react-bootstrap';
import classNames from 'classnames';

export class DownloadCard extends React.Component {
	render() {
		return (
			<Col className={classNames("DownloadCard", this.props.name)} key={this.props.name} xs={12}>
				<div className="tile clearfix">
					<Col xs={12}>
						<Button className="downloadButton" onClick={this.props.onClick}>
							<Col xsHidden className="buttonName">
								{this.props.name}
							</Col>
							<small>
								{this.props.format.toUpperCase()}
							</small>
						</Button>
					</Col>
					<Col xs={12}>
						<div className="descriptiveText">
							{this.props.children}
						</div>
					</Col>
				</div>
			</Col>
		);
	}
}
