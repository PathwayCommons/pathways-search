import React from 'react';
import {Button, Glyphicon, OverlayTrigger, Popover} from 'react-bootstrap';

import {SearchItem} from './SearchItem.jsx';

import {ErrorMessage} from '../../components/ErrorMessage.jsx';
import {Spinner} from '../../components/Spinner.jsx';

import PathwayCommonsService from '../../services/pathwayCommons/';

// SearchList
// Prop Dependencies ::
// - query
// - embed
export class SearchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      expanded: false,
      searchResults: []
    };
  }

  componentDidMount() {
    const props = this.props;
    this.getSearchResult(props.query);
  }

  componentWillReceiveProps(nextProps) {
    this.getSearchResult(nextProps.query);
  }

  getSearchResult(query) {
    this.setState({loading: true});
    PathwayCommonsService.querySearch(query)
      .then(searchResult => {
        this.setState({
          searchResults: searchResult.searchHit ? searchResult.searchHit : [],
          loading: false
        });
      });
  }

  render() {
    const props = this.props;
    const state = this.state;

    if (props.embed) { return null; }

    const expanded = state.expanded;
    const listCutoff = 5;

    const results = state.searchResults;

    const tip_hit = (
      <Popover className="info-tip" id="popover-hit" placement="bottom" title="Search Hit">
        Shown are each pathway's 'display name' and the original data source. 'Participants' refers to the number of physical entities including proteins and small molecules.
      </Popover>
    );

    const tip_more_results = (
      <Popover className="info-tip" id="popover-more-results" placement="bottom" title="More Results">
        By default the top 5 pathways are displayed. Click to display up to 100 of the remaining search hits.
      </Popover>
    );

    const searchResults = results.map((item, index) => {
      if (index === 0) {
        return (
          <SearchItem key={index} data={item}
            extras={
              (<span>{'        '}
                <OverlayTrigger placement="bottom" overlay={tip_hit} >
                  <Glyphicon className="glyph-tip" glyph="info-sign" />
                </OverlayTrigger>
              </span>)
            }
          />
        );
      } else {
        return (<SearchItem key={index} data={item} />);
      }
    }).slice(0, !expanded ? listCutoff : undefined);

    const moreResultsButton = (
      <div className="moreResults" onClick={() => this.setState({expanded: true})}>
        <OverlayTrigger delayShow={1000} placement="top" overlay={tip_more_results} >
          <Button bsSize="large" block>More Results</Button>
        </OverlayTrigger>
      </div>
    );

    return (
      <div className="SearchList">
        <Spinner full hidden={!this.state.loading}  />
        <ErrorMessage className="SearchList" hidden={this.state.loading || searchResults.length > 0}>
          No Search Results Found
        </ErrorMessage>
        { searchResults }
        { !expanded && results.length > listCutoff ? moreResultsButton : null }
      </div>
    );
  }
}