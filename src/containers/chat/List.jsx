import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
// import { listDateStr } from '../../utils/utils';

import Cell from '../../components/Cell';
import Scroll from '../../components/Scroll';

function listDateStr(a) {
  return a;
}

const Wrapper = styled.div`
  height: 100%;
  overflow: hidden;
`;

const StyleName = styled.div`
  font-size: 0.34rem;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyleMessafe = styled.div`
  font-size: 0.28rem;
  color: #888888;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyleDesc = styled.div`
  font-size: 0.24rem;
  color: #b2b2b2;
`;

const StyleAvatarImg = styled.img`
  width: 1rem;
`;

const StyledCell = styled(Cell)`
  padding: 0.2rem 0;
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const TitleBox = styled.div`
  width: 100%;
  padding-left: 0.2rem;
`;

const UnradBage = styled.span`
  display: inline-block;
  padding: 0.15em 0.4em;
  min-width: 18px;
  border-radius: 18px;
  background-color: #e64340;
  color: #fff;
  line-height: 1.2;
  text-align: center;
  font-size: 12px;
  vertical-align: middle;
  position: absolute;
  top: -8px;
  right: -10px;
  z-index: 11;
`;

class List extends React.Component {
  static defaultProps = {
    dataSource: []
  };

  handleClick = id => {
    this.props.history.push(`Chat/${id}`);
  };

  render() {
    const { dataSource } = this.props;

    const Avatar = item => {
      let content;

      if (item.unread > 0) {
        const unread = item.unread > 99 ? '99+' : item.unread;

        content = (
          <AvatarContainer>
            <StyleAvatarImg src={item.toAccountAvatar} />
            <UnradBage>{unread}</UnradBage>
          </AvatarContainer>
        );
      } else {
        content = (
          <AvatarContainer>
            <StyleAvatarImg src={item.toAccountAvatar} />
          </AvatarContainer>
        );
      }

      return content;
    };

    const Title = item => (
      <TitleBox>
        <StyleName>{item.toAccountNick}</StyleName>
        <StyleMessafe>{item.lastMsg}</StyleMessafe>
      </TitleBox>
    );

    const Description = item => (
      <StyleDesc>{listDateStr(item.lastMsgTime)}</StyleDesc>
    );

    return (
      <Wrapper>
        {dataSource.map((item, index) => {
          return (
            <StyledCell
              key={index}
              icon={Avatar(item)}
              title={Title(item)}
              description={Description(item)}
              onClick={() => this.handleClick(item.toAccount)}
            />
          );
        })}
      </Wrapper>
    );
  }
}

export default withRouter(List);
