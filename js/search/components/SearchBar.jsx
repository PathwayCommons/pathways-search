import React from 'react';

import {
  FormGroup, InputGroup, FormControl,
  OverlayTrigger, Popover, Glyphicon
} from 'react-bootstrap';

// SearchBar
// Prop Dependencies ::
// - query
// - updateSearchQuery
// - embed
export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: this.props.query
    };
  }

  submitSearchQuery(e) {
    // if the user presses enter, submit the query
    if (e.which == 13) {
      this.props.updateSearchQuery(this.state.query);
      e.target.blur();
    }
  }

  onSearchValueChange(e) {
    const newQueryState = {...this.state.query};
    newQueryState.q = e.target.value;
    this.setState({query: newQueryState});
  }

  render() {
    const props = this.props;
    const state = this.state;

    const showAdvancedButton = state.query.q && !props.embed;

    const tip_filter = (
      <Popover className="info-tip hidden-xs" id="popover-filter" placement="bottom" title="Filter">
        Refine search results by number of participants or data provider.
      </Popover>
    );

    return (
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
          onChange={(e) => this.onSearchValueChange(e)} onKeyPress={(e) => this.submitSearchQuery(e)} />
          <FormControl
            className="hidden-sm hidden-md hidden-lg"
            type="text"
            placeholder="Search pathways by name"
          value={state.query.q}
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
    );
  }

}