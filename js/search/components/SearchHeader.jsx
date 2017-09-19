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

import {SearchFaq} from '../../components/SearchFaq.jsx';

import {SearchOptions} from './SearchOptions.jsx';


// SearchHeader
// Prop Dependencies ::
// - query
// - embed
// - updateSearchQuery(updateObject)

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
    const state = this.state;
    const props = this.props;
    const uriRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    if (state.q.match(uriRegex)) {
      props.history.push({pathname: '/view', search: queryString.stringify({uri: state.q})});
    }
    else if (state.q != props.query.q) {
      props.updateSearchQuery({ // Set search and filter parameters to be used when q changes
        q: state.q,
        lt: 250,
        gt: 3,
        type: 'Pathway'
      });
    }
  }

  submitSearchQuery(e) {
    if (e.which == 13) {
      this.updateTerm();
      e.target.blur();
    }
  }

  onSearchValueChange(e) {
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

    const showAdvancedButton = props.query.q && !props.embed;
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
                      defaultValue={props.query.q}
                      onChange={(e) => this.onSearchValueChange(e)} onKeyPress={(e) => this.submitSearchQuery(e)} />
                      <FormControl
                        className="hidden-sm hidden-md hidden-lg"
                        type="text"
                        placeholder="Search pathways by name"
                      defaultValue={props.query.q}
                      onChange={(e) => this.onSearchValueChange(e)} onKeyPress={(e) => this.submitSearchQuery(e)} />
                      <InputGroup.Addon>
                        { showAdvancedButton ?
                          (<OverlayTrigger delayShow={1000} placement="left" overlay={tip_filter}>
                            <Glyphicon
                              id="glyph-filter"
                              glyph="filter"
                              onClick={() => this.toggleFilterMenu(true)}/>
                           </OverlayTrigger>) : null
                        }
                      </InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
              </Col>
            </Form>
          </Row>
        </Grid>
        <Modal show={state.showFilterMenu} onHide={() => this.toggleFilterMenu(false)}>
          <Modal.Header>
            <p className="header-title">Filter Options</p>
          </Modal.Header>
          <Modal.Body>
            <SearchOptions {...props}/>
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
