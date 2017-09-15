import React from 'react';
import classNames from 'classnames';
import {
  Grid, Row, Col,
  Glyphicon,
  ControlLabel, Form, FormGroup, InputGroup, FormControl,
  Modal,
  OverlayTrigger, Popover, Button
} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import queryString from 'query-string';

import {SearchOptions} from './SearchOptions.jsx';
import {SearchFaq} from './SearchFaq.jsx';


// SearchHeader
// Prop Dependencies ::
// - query
// - embed
// - updateSearchArg(updateObject)

// Note: Spread operator used to provide props to SearchOptions, therefore SearchBar also adopts SearchOptions dependencies in addition to those provided above
export class SearchHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      q: this.props.query.q || '',
      showFilterMenu: false,
      showSearchFaq: false
    };
  }

  updateTerm() {
    const uriRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    if (this.state.q.match(uriRegex)) {
      this.props.history.push({pathname: '/view', search: queryString.stringify({uri: this.state.q})});
    }
    else if (this.state.q != this.props.query.q) {
      this.props.updateSearchArg({ // Set search and filter parameters to be used when q changes
        q: this.state.q,
        lt: 250,
        gt: 3,
        type: 'Pathway'
      });
    }
  }

  submit(e) {
    if (e.which == 13) {
      this.updateTerm();
      e.target.blur();
    }
  }

  onChange(e) {
    this.setState({q: e.target.value});
  }

  toggleFilterMenu(state) {
    this.setState({
      showFilterMenu: state != null ? state : !this.state.showFilterMenu
    });
  }

  toggleSearchFaq(state) {
    this.setState({
      showSearchFaq: state != null ? state : !this.state.showSearchFaq
    });
  }

  populateWithExample(e, q) {
    e.stopPropagation();
    this.state.q = q;
    this.updateTerm();
  }

  render() {

    const tip_search = (
      <Popover className="info-tip" id="popover-brand" placement="bottom" title="Search!">
        Access metabolic pathways, signalling pathways and gene regulatory networks sourced from public pathway databases.
        <br/>
        <br/>
        <a className="clickable" onClick={e => this.populateWithExample(e, "ACVR2A BMP2 BMPR1B SMAD4")}>e.g. Gene list: 'Signaling by BMP' (Reactome)</a>
      </Popover>
    );

    const tip_faq = (
      <Popover className="info-tip" id="popover-faq" placement="bottom" title="Frequently Asked Questions">
        Find answers to common questions along with links to our forum and code repository.
      </Popover>
    );

    const tip_filter = (
      <Popover className="info-tip hidden-xs" id="popover-filter" placement="bottom" title="Filter">
        Refine search results by number of participants or data provider.
      </Popover>
    );

    var showAdvancedButton = this.props.query.q && !this.props.embed;
    return (
      <div className="SearchHeader">
        <Grid>
          <Row>
            <Form horizontal>
              { !this.props.embed &&
              <div>
                <Col xsOffset={1} xs={9} smOffset={0} sm={2} componentClass={ControlLabel}>
                  <Link to={{ pathname: '/' }}>
                    <span className="brand">Search</span>
                  </Link>
                </Col>
                <Col xs={1} sm={2} smPush={8}>
                  <OverlayTrigger delayShow={1000} placement="left" overlay={tip_faq}>
                    <Glyphicon
                      className="glyph-tip"
                      id="link-faq"
                      glyph="question-sign"
                      onClick={() => this.toggleSearchFaq(true)}/>
                  </OverlayTrigger>
                </Col>
              </div>
               }
               <Col xs={12}
                sm={!this.props.embed ? 8 : 12}
                smPull={!this.props.embed ? 2 : 0} >
                <FormGroup>
                    <InputGroup bsSize="large">
                      <FormControl
                        className="hidden-xs"
                        type="text"
                        placeholder={ !this.props.embed ?
                          'Search pathways by name, gene names or type a URI' :
                          'Search pathways in Pathway Commons'
                        }
                      defaultValue={this.props.query.q}
                      onChange={(e) => this.onChange(e)} onKeyPress={(e) => this.submit(e)} />
                      <FormControl
                        className="hidden-sm hidden-md hidden-lg"
                        type="text"
                        placeholder="Search pathways by name"
                      defaultValue={this.props.query.q}
                      onChange={(e) => this.onChange(e)} onKeyPress={(e) => this.submit(e)} />
                      <InputGroup.Addon>
                        { showAdvancedButton ?
                          (<OverlayTrigger delayShow={1000} placement="left" overlay={tip_filter}>
                            <Glyphicon
                              id="glyph-filter"
                              glyph="filter"
                              onClick={() => this.toggleFilterMenu(true)}/>
                           </OverlayTrigger>) :
                          (<OverlayTrigger delayShow={1000} delayHide={2000} placement="left" overlay={tip_search}>
                            <Glyphicon
                              id="glyph-search"
                              glyph="search"
                              onClick={() => this.updateTerm()}/>
                           </OverlayTrigger>)
                        }
                      </InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
              </Col>
            </Form>
          </Row>
        </Grid>
        <Modal show={this.state.showFilterMenu} onHide={() => this.toggleFilterMenu(false)}>
          <Modal.Header>
            <p className="header-title">Filter Options</p>
          </Modal.Header>
          <Modal.Body>
            <SearchOptions {...this.props}/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.toggleFilterMenu(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
        <Modal bsSize="large" show={this.state.showSearchFaq} onHide={() => this.toggleSearchFaq(false)}>
          <Modal.Header>
            <p className="header-title">Frequently Asked Questions</p>
          </Modal.Header>
          <Modal.Body>
            <SearchFaq/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.toggleSearchFaq(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
