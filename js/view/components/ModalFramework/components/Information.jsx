import React from 'react';
import classNames from 'classnames';

import PathwayCommonsService from '../../../../services/pathwayCommons/';

// Information
// Prop Dependencies ::
// uri
export class Information extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: []
    };

    PathwayCommonsService.query(props.uri, 'json', 'Entity/comment')
      .then(responses => {
        this.setState({
          comments: responses ? responses.traverseEntry[0].value : []
        });
      });
  }

  render() {
    return(
      <div className={classNames('Information', (this.props.hidden ? 'hidden' : ''))}>
        {this.state.comments.map((comment, index) => {
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
