import React from 'react';

import {
  FormGroup, InputGroup, FormControl
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

    return (
      <FormGroup>
        <InputGroup bsSize="large">
          <FormControl
            className="hidden-xs"
            type="text"
            placeholder={ !props.embed ? 'Search pathways by name, gene names or type a URI' : 'Search pathways in Pathway Commons'}
            value={state.query.q}
            onChange={(e) => this.onSearchValueChange(e)} onKeyPress={(e) => this.submitSearchQuery(e)}
          />
          <FormControl
            className="hidden-sm hidden-md hidden-lg"
            type="text" placeholder="Search pathways by name" value={state.query.q}
            onChange={(e) => this.onSearchValueChange(e)} onKeyPress={(e) => this.submitSearchQuery(e)}
          />
          <InputGroup.Addon>
            {props.children}
          </InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    );
  }

}