import React from 'react';
import queryString from 'query-string';
import {
  Grid, Row, Col,
  Glyphicon,
  ControlLabel, Form, FormGroup, InputGroup, FormControl,
  Modal,
  OverlayTrigger, Popover, Button
} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import {SearchFaq} from '../../components/SearchFaq.jsx';


// SearchHeader
// Prop Dependencies ::
// - embed

export class SearchHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {
        q:'',
        gt: 3,
        lt: 250,
        type: 'Pathway'
      },
      showFilterMenu: false,
      showSearchFaq: false
    };
  }

  submitSearchQuery(e) {
    const state = this.state;
    const props = this.props;
    const uriRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    const isUri = state.query.q.match(uriRegex) || decodeURIComponent(state.query.q).match(uriRegex);
    if (isUri) {
      props.history.push({
        pathname: '/view',
        search: queryString.stringify({uri: state.query.q}),
        state: {}
      });
    } else {
      props.history.push({
        pathname: '/search',
        search: queryString.stringify(state.query),
        state: {}
      });
    }
    e.target.blur();
  }

  onSearchValueChange(e) {
    // if the user presses enter, submit the query
    if (e.which && e.which ===  13) {
      this.submitSearchQuery(e);
    } else {
      const newQueryState = {...this.state.query};
      newQueryState.q = e.target.value;
      this.setState({query: newQueryState});
    }
  }

  toggleSearchFaq() {
    this.setState({
      showSearchFaq: !this.state.showSearchFaq
    });
  }

  showExampleQuery() {
    const newQueryState = {...this.state.query};
    newQueryState.q = 'ACVR2A BMP2 BMPR1B SMAD4';
    this.setState({query: newQueryState});
  }

  render() {
    const props = this.props;
    const state = this.state;

    const tip_search = (
      <Popover className="info-tip" id="popover-brand" placement="bottom" title="Search!">
        Access metabolic pathways, signalling pathways and gene regulatory networks sourced from public pathway databases.
        <br/>
        <br/>
        <a onClick={e =>  this.showExampleQuery()}>e.g. Gene list: 'Signaling by BMP' (Reactome)</a>
      </Popover>
    );

    const tip_faq = (
      <Popover className="info-tip" id="popover-faq" placement="bottom" title="Frequently Asked Questions">
        Find answers to common questions along with links to our forum and code repository.
      </Popover>
    );

    return (
      <div className="SearchHeader">
        <Grid>
          <Row>
            <Form horizontal>
              { !props.embed &&
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
                sm={!props.embed ? 8 : 12}
                smPull={!props.embed ? 2 : 0} >
                <FormGroup>
                    <InputGroup bsSize="large">
                      <FormControl
                        className="hidden-xs"
                        type="text"
                        placeholder={ !props.embed ?
                          'Search pathways by name, gene names or type a URI' :
                          'Search pathways in Pathway Commons'
                        }
                      value={state.query.q}
                      onChange={e => this.onSearchValueChange(e)} onKeyPress={e => this.onSearchValueChange(e)}/>
                      <FormControl
                        className="hidden-sm hidden-md hidden-lg"
                        type="text"
                        placeholder="Search pathways by name"
                      value={state.query.q}
                      onChange={e => this.onSearchValueChange(e)} onKeyPress={e => this.onSearchValueChange(e)}/>
                      <InputGroup.Addon>
                        <OverlayTrigger delayShow={1000} delayHide={2000} placement="left" overlay={tip_search}>
                          <Glyphicon id="glyph-search" glyph="search" onClick={(e) => this.submitSearchQuery(e)}/>
                        </OverlayTrigger>
                      </InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
              </Col>
            </Form>
          </Row>
        </Grid>
        <Modal bsSize="large" show={state.showSearchFaq} onHide={() => this.toggleSearchFaq()}>
          <Modal.Header>
            <p className="header-title">Frequently Asked Questions</p>
          </Modal.Header>
          <Modal.Body>
            <SearchFaq/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.toggleSearchFaq()}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
