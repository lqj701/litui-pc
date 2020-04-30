import styled from 'styled-components';

const px2rem = unit => {
  // return `${unit/100 * 2}rem`;
};

const rem2px = unit => {
  return `${(unit * 100) / 2}px`;
};

export const Wrapper = styled.div`
  background: rgba(239, 239, 244, 1);
  height: ${rem2px(1)};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.1);
  padding: 0 ${rem2px(0.3)};
  z-index: 20;
`;

export const Input = styled.input`
  background: #fdfdfe;
  border: 1px solid #b4b6ba;
  border-radius: ${rem2px(0.08)};
  height: ${rem2px(0.72)};
  flex: 1;
  outline: 0;
  font-size: ${rem2px(0.32)};
  padding: 0 ${rem2px(0.15)};
`;

export const Button = styled.button`
  background: #f4f4f4;
  border: 1px solid #b4b6ba;
  border-radius: ${rem2px(0.08)};
  opacity: 0.85;
  font-family: PingFangSC-Regular;
  font-size: ${rem2px(0.28)};
  color: #000000;
  outline: 0;
  margin-left: ${rem2px(0.2)};
  height: ${rem2px(0.72)};
  width: ${rem2px(1.36)};

  &:active {
    opacity: 0.5;
  }
`;
