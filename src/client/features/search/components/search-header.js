import React from 'react';
import {Link} from 'react-router-dom';

import {
  Grid, Row, Col,
  Glyphicon,
  ControlLabel, Form,
  Modal,
  OverlayTrigger, Popover, Button
} from 'react-bootstrap';

import {SearchBar, SearchFaq} from '../../common-components/';

import {SearchOptions} from './search-options';

// SearchHeader
// Prop Dependencies ::
// - query
// - embed
// - updateSearchQuery(query)

// Note: Spread operator used to provide props to SearchOptions, therefore SearchBar also adopts SearchOptions dependencies in addition to those provided above
export class SearchHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilterMenu: false,
      showSearchFaq: false
    };
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

  render() {
    const props = this.props;
    const state = this.state;

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
               <Col xs={12} sm={!props.embed ? 8 : 12} smPull={!props.embed ? 2 : 0} >
                <SearchBar query={props.query} embed={props.embed} updateSearchQuery={props.updateSearchQuery} >
                  <OverlayTrigger delayShow={1000} placement="left" overlay={tip_filter}>
                    <Glyphicon id="glyph-filter" glyph="filter" onClick={() => this.toggleFilterMenu(true)}/>
                  </OverlayTrigger>
                </SearchBar>
              </Col>
            </Form>
          </Row>
        </Grid>
        <Modal show={state.showFilterMenu} onHide={() => this.toggleFilterMenu(false)}>
          <Modal.Header>
            <p className="header-title">Filter Options</p>
          </Modal.Header>
          <Modal.Body>
            <SearchOptions query={props.query} updateSearchQuery={props.updateSearchQuery}/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.toggleFilterMenu(false)}>Confirm</Button>
          </Modal.Footer>
        </Modal>
        <Modal bsSize="large" show={state.showSearchFaq} onHide={() => this.toggleSearchFaq(false)}>
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
