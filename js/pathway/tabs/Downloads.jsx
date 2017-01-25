import React from 'react';
import classNames from 'classnames';
import {Col, Button} from 'react-bootstrap';
import {saveAs} from 'file-saver';
import {httpGetAsync, getPathwayURL} from '../../helpers/http.js';
import {getDataFormats} from '../../helpers/pc2.js';

export class Downloads extends React.Component {
	initiateDownload(format, file_ext) {
		const FILENAME_CUTOFF = 20;
		var filename = this.props.name || "pathway";
		filename = filename.substr(0, filename.length < FILENAME_CUTOFF ? filename.length : FILENAME_CUTOFF).replace(/ /g, "_");
		httpGetAsync(getPathwayURL(this.props.location.query.uri, format), (responseText) => {
			saveAs(new File([responseText], filename + "." + file_ext, {type: "text/plain;charset=utf-8"}));
		});
	}

	render() {
		return(
			<div className={classNames("Downloads", (this.props.hidden ? "hidden" : ""))}>
				<br/>
				<div className="downloadContainer clearfix">
					{getDataFormats.map((item, index) => {
						return(
							<Col key={index} xs={12} sm={6} md={4}>
								<div className="tile">
									<div className="formatName">
										{item.pc2.replace(/_/g, " ")}
									</div>
									<br/>
									<Button onClick={() => {this.initiateDownload(item.pc2, item.file_ext)}}>
										Download
									</Button>
								</div>
							</Col>
						);
					})}
				</div>
			</div>
		);
	}
}
