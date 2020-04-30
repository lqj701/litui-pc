import styled from 'styled-components';
import { rem2px } from '../core/unit';

export const Wrapper = styled.div`
  position: relative;
  background: #fff;
  padding: ${rem2px(0.3)};
  margin: ${rem2px(0.3)} 0;
  border-radius: 6px;

  ${({ active }) =>
    active
      ? `&:active {
  background-color: #ddd;
}`
      : ''};
`;
