import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  font-size: 15px;
  min-height: 40px;

  justify-content: ${({ direction }) =>
    direction === 'left' ? 'start' : 'flex-end'};
`;
const Body = styled.div`
  position: relative;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.85);
  border-radius: 5px;
  padding: 10px;
  max-width: 60%;
  margin: 0 10px;
  word-break: break-word;

  &:before {
    content: ' ';
    position: absolute;
    top: 9px;
    right: 100%;
    border: 6px solid transparent;
    border-right-color: rgba(74,140,242,0.08);;

    ${({ direction }) =>
    direction === 'left'
      ? ''
      : `
    right: inherit;
    left: 100%;
    border-right-color: transparent;
    border-left-color: rgba(0,0,0,0.04);
    `};
  }

  // border: 1px solid
  //   ${({ direction }) => (direction === 'left' ? 'rgba(74,140,242,0.08);' : ' #84d55a')};

  background: ${({ direction }) =>
    direction === 'left' ? 'rgba(74,140,242,0.08)' : 'rgba(0,0,0,0.04)'};
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;

  text-align: center;
  > img {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
  }
`;

const BadgeWrapper = styled.div`
  text-align: center;
  padding: 13px 0;
`;

const Badge = styled.span`
  background-color: #cfcfcf;
  border-radius: 4px;
  font-size: 14px;
  height: 18px;
  padding: 0 5px;
  white-space: nowrap;
  color: #fff;
`;

class Message extends PureComponent {
  static propTypes = {
    date: PropTypes.any,
    direction: PropTypes.string,
    avatar: PropTypes.string,
    date: PropTypes.any,
    children: PropTypes.any,
    onClick: PropTypes.any
  };

  static defaultProps = {
    direction: 'left',
    hideTime: false
  };

  renderTime() {
    const { hideTime, date } = this.props;
    let content = '';

    if (!hideTime) {
      content = <Badge>{date}</Badge>;
    }

    return content;
  }

  render() {
    const { direction, avatar, children, onClick } = this.props;
    const Info = () => <Body direction={direction}>{children}</Body>;

    return (
      <div>
        <BadgeWrapper>{this.renderTime()}</BadgeWrapper>
        <Wrapper direction={direction}>
          {direction === 'right' && <Info />}
          <Icon onClick={onClick}>{avatar && <img src={avatar} />}</Icon>
          {direction === 'left' && <Info />}
        </Wrapper>
      </div>
    );
  }
}

export default Message;
