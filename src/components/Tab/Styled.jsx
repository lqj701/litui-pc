import styled, { css } from 'styled-components';

export const Wrapper = styled.div``;
export const Header = styled.div`
  position: relative;
`;
export const Line = styled('div')`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  transition: left 0.3s ease-out;

  background-color: #f00;
`;
export const Content = styled.div``;
export const Ul = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  height: 45px;
  line-height: 45px;

  margin-left: 120px;
`;
export const Li = styled('li')`
  text-align: center;
  color: #333;
  cursor: pointer;

  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  width: 100px;
  background-color: #ddd;
  border-top: 3px solid #ddd;
  margin-right: 10px;

  ${({ active }) =>
    active &&
    css`
      background-color: white;
      border-top: 3px solid #108ee9;
    `};

  ${({ disabled }) =>
    disabled &&
    css`
      color: #bbb;
      cursor: not-allowed;
    `};
`;

export const Prefix = styled.div`
  position: absolute;
  left: 0;

  font-size: 20px;
  font-weight: 900;
  line-height: 45px;
`;

export const Suffix = styled.div`
  position: absolute;
  right: 0;
  top: 0;

  line-height: 45px;
`;
