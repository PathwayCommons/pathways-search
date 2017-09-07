import React from 'react';
import classNames from 'classnames';
import {traverse} from 'pathway-commons';

// Information
// Prop Dependencies ::
// uri
export class Information extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentArray: []
    };

    traverse()
      .uri(this.props.uri)
      .path('Entity/comment')
      .format('json')
      .fetch()
      .then(responseArray => this.setState({commentArray: responseArray.traverseEntry[0].value}));
  }

  render() {
    return(
      <div className={classNames('Information', (this.props.hidden ? 'hidden' : ''))}>
        {this.state.commentArray.map((comment, index) => {
          return (
            <div className="comment" key={index}>
              {comment}
              <br/>
              <br/>
            </div>
          );
        })}
      </div>
    );
  }
}
