import React from 'react';
import {Button, Glyphicon, OverlayTrigger, Popover} from 'react-bootstrap';

import {SearchItem} from './SearchItem.jsx';

import {ErrorMessage} from '../../components/ErrorMessage.jsx';

// SearchList
// Prop Dependencies ::
// - searchResult
// - embed
// - updateSearchArg(updateObject)
export class SearchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  render() {
    const props = this.props;
    const state = this.state;

    if (props.embed) { return null; }

    const searchData = props.searchResult;
    const expanded = state.expanded;
    const listCutoff = 5;

    const results = searchData.searchHit ? searchData.searchHit : [];

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

    if (results.length > 0) { // Generate search list if results available
      return (
        <div className="SearchList">
          { searchResults }
          { !expanded && results.length > listCutoff ? moreResultsButton : null }
        </div>
      );
    } else {
      return (
        <ErrorMessage className="SearchList">
          No Search Results Found
        </ErrorMessage>
      );
    }
  }
}
