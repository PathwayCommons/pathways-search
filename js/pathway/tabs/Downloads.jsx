import React from 'react';
import classNames from 'classnames';
import {Col, Button} from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';
import {saveAs} from 'file-saver';
import {get} from 'pathway-commons';
import {getDataFormats} from '../../helpers/pc2.js';

// Downloads
// Prop Dependencies ::
// - name
// - uri
// - pathwayData
export class Downloads extends React.Component {
	initiatePCDownload(format, file_ext) {
		get()
			.uri(this.props.uri)
			.format(format)
			.fetch()
			.then(content => this.saveDownload(file_ext, typeof content === "object" ? JSON.stringify(content) : content));
	}

	saveDownload(file_ext, content) {
		saveAs(new File([content], this.generatePathwayName() + "." + file_ext, {type: "text/plain;charset=utf-8"}));
	}

	generatePathwayName() {
		const FILENAME_CUTOFF = 20;
		var filename = this.props.name || "pathway";
		return filename.substr(0, filename.length < FILENAME_CUTOFF ? filename.length : FILENAME_CUTOFF).replace(/ /g, "_");
	}

	generateDownloadCard(cardName, onClick) {
		return (
			<Col xs={12} sm={6} md={4}>
				<div className="tile">
					<div className="formatName">
						{cardName}
					</div>
					<br/>
					<Button onClick={onClick}>
						Download
					</Button>
				</div>
			</Col>
		);
	}

	render() {
		return(
			<div className={classNames("Downloads", (this.props.hidden ? "hidden" : ""))}>
				<br/>
				<div className="downloadContainer clearfix">
					{/* All generate all standard PC file downloads */}
					{getDataFormats.map((item, index) => {
						return this.generateDownloadCard(item.pc2.replace(/_/g, " "), () => {this.initiatePCDownload(item.pc2, item.file_ext)});
					})}
					{/* All custom download links go below */}
					{!isEmpty(this.props.pathwayData) ? this.generateDownloadCard("Cytoscape JSON", () => {this.saveDownload("json", JSON.stringify(this.props.pathwayData, null, 2))}) : null}
				</div>
			</div>
		);
	}
}
