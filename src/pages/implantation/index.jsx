import React, { Component } from 'react';
import styled from 'styled-components';
import InstantMessag from '../../containers/chat/InstantMessag';
import History from '../../containers/chat/History';
import Intelligence from '../../containers/intelligence';

const Wrapper = styled.div`
  display: flex;
  height: 620px;
  width: 1000px;
  box-shadow: 0 7px 8px -4px rgba(0, 0, 0, 0.2),
    0 12px 17px 2px rgba(0, 0, 0, 0.14), 0 5px 22px 4px rgba(0, 0, 0, 0.12);
  background: rgb(237, 236, 242);
`;

export default class index extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = {
      isSwitchHistory: false
    };
  }

  componentDidMount() {}

  handleSwitchClick = () => {
    this.setState({ isSwitchHistory: !this.state.isSwitchHistory });
  };

  render() {
    return (
      <Wrapper>
        <Intelligence />
        <InstantMessag onSwitchHistory={this.handleSwitchClick} />
        {/* {this.state.isSwitchHistory && <History />} */}
        <History />
      </Wrapper>
    );
  }
}
