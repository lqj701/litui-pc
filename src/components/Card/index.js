import React from 'react';
import { Wrapper } from './Styled';

export default ({ children, active, ...other }) => {
  return (
    <Wrapper active={active} {...other}>
      {children}
    </Wrapper>
  );
};
