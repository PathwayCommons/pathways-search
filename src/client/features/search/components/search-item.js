import React from 'react';
import {Col, Image} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import isEqual from 'lodash.isequal';
import queryString from 'query-string';

import {PathwayCommonsService} from '../../../services/';

// SearchItem
// This component is only meant to be called by SearchList
// Prop Dependencies ::
// - data
export class SearchItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSource: ''
    };
    this.updateImage(this.props.data.dataSource[0]);
  }

  // If query prop or dataSource is changed then re-render
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.data, nextProps.data)) {
      this.updateImage(nextProps.data.dataSource[0]);
    }
  }

  updateImage(datasource) {
    PathwayCommonsService.lookupDataSourceIcon(datasource).then(iconUrl => this.setState({imageSource: iconUrl}));
  }

  render() {
    const props = this.props;
    const state = this.state;
    const data = props.data;

    return (
      <div className="SearchItem clearfix">
        <Col smOffset={1} sm={3} className="src-thumbnail-container hidden-xs">
          <div className="src-thumbnail">
            <Image src={state.imageSource} />
          </div>
        </Col>
        <Col className="metadata-wrapper" xs={12} sm={8}>
          <div className="header">
              <Link to={{pathname: '/view', search: queryString.stringify({uri: data.uri})}} target="_blank">
                <span className="title">{data.name}</span>
              </Link>
              { props.extras }
          </div>
          <div className="subtext">
              <span className="source">{data.sourceInfo.name}</span>
              <br/>
              <span className="participants">{(data.numParticipants || '0') + ' Participants'} </span>
          </div>
        </Col>
      </div>
    );
  }
}
