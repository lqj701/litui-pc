import React, { PureComponent } from 'react';
import styled, { css } from 'styled-components';

const Wrapper = styled('div')`
  display: none;

  ${({ active }) =>
    active &&
    css`
      display: block;
    `};
`;

export default class TabPanel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: props.active
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('active' in nextProps) {
      this.setState({
        active: !!nextProps.active
      });
    }
  }

  render() {
    const { children } = this.props;
    const { active } = this.state;
    return <Wrapper active={active}>{children}</Wrapper>;
  }
}
