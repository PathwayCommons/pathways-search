import React from 'react';
import classNames from 'classnames';
import {Col, Button, Glyphicon} from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';
import {saveAs} from 'file-saver';
import {get} from 'pathway-commons';
import {DownloadCard} from './DownloadCard.jsx';
import {Spinner} from '../../components/Spinner.jsx';

// Downloads
// Prop Dependencies ::
// - name
// - uri
// - pathwayData
// - graphImage
export class Downloads extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false
		};
	}

	toggleLoading() {
		this.setState({loading: !this.state.loading});
	}

	initiatePCDownload(format, file_ext) {
		this.toggleLoading();
		get()
			.uri(this.props.uri)
			.format(format)
			.fetch()
			.then(content => this.saveDownload(file_ext, typeof content === "object" ? JSON.stringify(content) : content))
			.then(() => this.toggleLoading());
	}

	saveDownload(file_ext, content) {
		saveAs(new File([content], this.generatePathwayName() + "." + file_ext, {type: "text/plain;charset=utf-8"}));
	}

	generatePathwayName() {
		const FILENAME_CUTOFF = 20;
		var filename = this.props.name || "pathway";
		return filename.substr(0, filename.length < FILENAME_CUTOFF ? filename.length : FILENAME_CUTOFF).replace(/ /g, "_");
	}

	render() {
		return(
			<div className={classNames("Downloads", (this.props.hidden ? "hidden" : ""))}>
				<Spinner full hidden={!this.state.loading}/>
				<div className="downloadContainer clearfix">
					{/* All custom download links go below */}
					<DownloadCard name="Image" format="png" onClick={() => {
							// Allow 10ms for toggleloading to finish before calling graphImage or else toggleLoading does not work properly
							this.toggleLoading();
							setTimeout(() => this.props.graphImage(true, () => this.toggleLoading()), 10);
					}}>
						Download an image of the entire view. If you wish to capture only a subsection, use the 'Screenshot' link in the main viewer.
						<br/><br/>
						Format: PNG
					</DownloadCard>
					<DownloadCard name="Gene Set Database" format="gmt" onClick={() => {this.initiatePCDownload("GSEA", "gmt")}}>
						Database of named gene sets (UniProt) useful for performing enrichment analysis using <a target="_blank" href="http://software.broadinstitute.org/gsea/index.jsp">Gene Set Enrichment Analysis (GSEA)</a>.
						<br/><br/>
						Format: <a target="_blank" href="http://software.broadinstitute.org/cancer/software/gsea/wiki/index.php/Data_formats#GMT:_Gene_Matrix_Transposed_file_format_.28.2A.gmt.29">GMT</a>
					</DownloadCard>
					<DownloadCard name="Simple Interaction Format" format="sif" onClick={() => {this.initiatePCDownload("BINARY_SIF", "sif")}}>
						A list of interaction pairs useful for:
						<ul>
							<li>
								Viewing, styling, and editing using <a target="_blank" href="http://cytoscape.org/">Cytoscape desktop software</a>
							</li>
							<li>
								Analysis with graph algorithms
							</li>
						</ul>
						Format: <a target="_blank" href="http://wiki.cytoscape.org/Cytoscape_User_Manual/Network_Formats">SIF</a>
					</DownloadCard>
				</div>
			</div>
		);
	}
}
