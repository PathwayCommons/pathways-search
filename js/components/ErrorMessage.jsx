import React from 'react';
import h from 'react-hyperscript';
import classNames from 'classnames';

// ErrorMessage
// Prop Dependencies ::
// - children
// - className
export class ErrorMessage extends React.Component {
  render() {
    return (
      h(`div.${classNames('ErrorMessage', this.props.className)}`, [
        this.props.children || 'Error'
      ])
    );
  }
}
