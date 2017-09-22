import React from 'react';
import classNames from 'classnames';

// prop dependencies::
// - hidden
export class ErrorMessage extends React.Component {
  render() {
    return (
			<div className={classNames('ErrorMessage', this.props.hidden ? 'hidden' : '')}>
				{this.props.children || 'Error'}
			</div>
    );
  }
}
