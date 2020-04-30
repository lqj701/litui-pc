import React from 'react';
import styled from 'styled-components';
import numberLimitImgUrl from '../../../assets/images/number-limit.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

function Denied() {
  return (
    <Wrapper>
      <img src={numberLimitImgUrl} alt="没有权限" width="375px" height="270px" />
      <p>你没有权限哦...</p>
    </Wrapper>
  );
}

export default Denied;

