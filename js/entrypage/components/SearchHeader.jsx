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

import {SearchFaq} from '../../components/SearchFaq.jsx';


// SearchHeader
// Prop Dependencies ::
// - embed
// - queryConfig

// Note: Spread operator used to provide props to SearchOptions, therefore SearchBar also adopts SearchOptions dependencies in addition to those provided above
export class SearchHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {
        value:'',
        minGraphSize: 3,
        maxGraphSize: 250,
        type: 'Pathway'
      },
      showFilterMenu: false,
      showSearchFaq: false
    };
  }

  submit(e) {
    const p = this.props;
    p.history.push({
      pathname: '/search/',
      search: this.formatQueryString(),
      state: {}
    });
    e.target.blur();
  }

  onChange(e) {
    if (e.which && e.which ===  13) {
      this.submit(e);
    } else {
      const newQueryState = {...this.state.query};
      newQueryState.value = e.target.value;
      this.setState({query: newQueryState});
    }
  }

  formatQueryString() {
    const s = this.state;
    return `?gt=${s.query.minGraphSize}&lt=${s.query.maxGraphSize}&type=${s.query.type}&q=${s.query.value}`;
  }

  toggleSearchFaq() {
    this.setState({
      showSearchFaq: !this.state.showSearchFaq
    });
  }

  render() {
    const p = this.props;
    const s = this.state;

    const tip_search = (
      <Popover className="info-tip" id="popover-brand" placement="bottom" title="Search!">
        Access metabolic pathways, signalling pathways and gene regulatory networks sourced from public pathway databases.
        <br/>
        <br/>
        <a onClick={e => this.setState({q: 'ACVR2A BMP2 BMPR1B SMAD4'})}>e.g. Gene list: 'Signaling by BMP' (Reactome)</a>
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
              { !p.embed &&
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
                sm={!p.embed ? 8 : 12}
                smPull={!p.embed ? 2 : 0} >
                <FormGroup>
                    <InputGroup bsSize="large">
                      <FormControl
                        className="hidden-xs"
                        type="text"
                        placeholder={ !p.embed ?
                          'Search pathways by name, gene names or type a URI' :
                          'Search pathways in Pathway Commons'
                        }
                      value={s.query.value}
                      onChange={e => this.onChange(e)} onKeyPress={e => this.onChange(e)}/>
                      <FormControl
                        className="hidden-sm hidden-md hidden-lg"
                        type="text"
                        placeholder="Search pathways by name"
                      value={s.query.value}
                      onChange={e => this.onChange(e)} onKeyPress={e => this.onChange(e)}/>
                      <InputGroup.Addon>
                        <OverlayTrigger delayShow={1000} delayHide={2000} placement="left" overlay={tip_search}>
                          <Glyphicon id="glyph-search" glyph="search" onClick={this.submit}/>
                        </OverlayTrigger>
                      </InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
              </Col>
            </Form>
          </Row>
        </Grid>
        <Modal bsSize="large" show={s.showSearchFaq} onHide={() => this.toggleSearchFaq()}>
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
