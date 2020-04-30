import React from 'react';
import propsType from 'prop-types';
import styled from 'styled-components';
import { rem2px } from '../core/unit';

import Card from '../Card';
import Badge from '../Badge';

const Wrapper = styled.div`
  display: flex;
  font-size: 15px;
  min-height: 45px;
`;
const Body = styled.div`
  flex: 1;
  font-size: ${rem2px(0.3)};
  color: rgba(0, 0, 0, 0.85);
  line-height: ${rem2px(0.5)};
  ${({ direction }) =>
    direction === 'left'
      ? `margin-left: ${rem2px(0.2)};`
      : `margin-right: ${rem2px(0.2)};`};
`;

const Icon = styled.div`
  width: ${rem2px(1)};
  height: ${rem2px(1)};

  text-align: center;
  > img {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
  }
`;

const BadgeWrapper = styled.div`
  text-align: center;
  padding: ${rem2px(0.26)} 0;
`;

export default class MessageBox extends React.Component {
  static propTypes = {
    direction: propsType.string,
    avatar: propsType.string,
    date: propsType.any,
    children: propsType.any,
    onClick: propsType.any
  };

  static defaultProps = {
    direction: 'left'
  };

  handleClick = () => {
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  };

  render() {
    const { direction, avatar, date, children, onClick } = this.props;

    const Info = () => (
      <Body
        direction={direction}
        dangerouslySetInnerHTML={{ __html: children }}
      />
    );

    return (
      <div
        style={{ marginLeft: rem2px(0.3), marginRight: rem2px(0.3) }}
        onClick={onClick}
      >
        {date && (
          <BadgeWrapper>
            <Badge color="grey" shape="radius" text={date} />
          </BadgeWrapper>
        )}
        <Card active={!!onClick}>
          <Wrapper>
            {direction === 'right' && <Info />}
            <Icon>{avatar && <img src={avatar} />}</Icon>
            {direction === 'left' && <Info />}
          </Wrapper>
        </Card>
      </div>
    );
  }
}
