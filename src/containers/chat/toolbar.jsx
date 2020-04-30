import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  font-size: 14px;
  padding: 12px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
`;

const Action = styled.div`
  padding-right: 12px;
  cursor: pointer;
  &:hover {
    color: #1890ff;
  }
`;

export default class toolbar extends Component {
  handleChatClick = () => {
    const { onChatClick } = this.props;
    onChatClick && onChatClick();
  };

  handleIntelligenceClick = () => {
    const { onIntelligenceClick } = this.props;
    onIntelligenceClick && onIntelligenceClick();
  };

  render() {
    return (
      <Wrapper>
        {/* <Action onClick={this.handleItelligenceClick}>情报数据</Action> */}
        <Action onClick={this.handleChatClick}>聊天记录</Action>
      </Wrapper>
    );
  }
}
