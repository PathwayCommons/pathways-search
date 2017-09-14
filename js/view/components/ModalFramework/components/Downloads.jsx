import React from 'react';
import {Button, Col} from 'react-bootstrap';
import classNames from 'classnames';
import {saveAs} from 'file-saver';

import {Spinner} from '../../../../components/Spinner.jsx';

import PathwayCommonsService from '../../../../services/pathwayCommons/';

// DownloadCard
// Prop Dependencies ::
// - name
// - children
class DownloadCard extends React.Component {
  render() {
    return (
      <Col className={classNames('DownloadCard', this.props.name)} key={this.props.name} xs={12}>
        <div className="tile clearfix">
          <Col xs={12}>
            <Button className="downloadButton" onClick={this.props.onClick}>
              <Col className="buttonName">
                {this.props.name}
              </Col>
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

// Downloads
// Prop Dependencies ::
// - name
// - uri
// - cy
export class Downloads extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  initiatePCDownload(format, file_ext) {
    this.setState({loading: !this.state.loading});

    PathwayCommonsService.query(this.props.uri, format)
      .then(content => {
        let fileContent = content;
        if (typeof content === 'object') {
          fileContent = JSON.stringify(content);
        }
        this.saveDownload(file_ext, fileContent);
      })
      .then(() => this.setState({loading: !this.state.loading}));
  }

  saveDownload(file_ext, content) {
    saveAs(new File([content], this.generatePathwayName() + '.' + file_ext, {type: 'text/plain;charset=utf-8'}));
  }

  generatePathwayName() {
    const FILENAME_CUTOFF = 20;
    var filename = this.props.name || 'pathway';
    return filename.substr(0, filename.length < FILENAME_CUTOFF ? filename.length : FILENAME_CUTOFF).replace(/ /g, '_');
  }

  render() {
    return(
      <div className={classNames('Downloads', (this.props.hidden ? 'hidden' : ''))}>
        <Spinner full={true} hidden={!this.state.loading}/>
        <div className="downloadContainer clearfix">
          {/* All custom download links go below */}
          <DownloadCard name="Image" format="png" onClick={() => {
            const imgBlob = this.props.cy.png({
              output: 'blob',
              scale: 5,
              bg: 'white',
              full: true
            });
            saveAs(imgBlob, this.props.name  + '.png');
          }}>
            Download an image of the entire view. If you wish to capture only a subsection, use the 'Screenshot' link in the main viewer.
            <br/><br/>
            Format: PNG
          </DownloadCard>
          <DownloadCard name="Gene Set Database" format="gmt" onClick={() => {this.initiatePCDownload('GSEA', 'gmt')}}>
            Database of named gene sets (UniProt) useful for performing enrichment analysis using <a target="_blank" href="http://software.broadinstitute.org/gsea/index.jsp">Gene Set Enrichment Analysis (GSEA)</a>.
            <br/><br/>
            Format: <a target="_blank" href="http://software.broadinstitute.org/cancer/software/gsea/wiki/index.php/Data_formats#GMT:_Gene_Matrix_Transposed_file_format_.28.2A.gmt.29">GMT</a>
          </DownloadCard>
          <DownloadCard name="Simple Interaction Format" format="sif" onClick={() => {this.initiatePCDownload('BINARY_SIF', 'sif')}}>
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
