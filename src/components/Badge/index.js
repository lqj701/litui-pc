import React, { PureComponent } from 'react';
import { Wrapper, Sup } from './Styled';

export default class Badge extends PureComponent {
  static defaultProps = {
    position: 'right',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      children,
      text,
      shape,
      sup,
      color,
      position,
      ...other
    } = this.props;

    return (
      <Wrapper {...other}>
        {children}
        <Sup shape={shape} sup={sup} color={color} position={position}>
          {text}
        </Sup>
      </Wrapper>
    );
  }
}
