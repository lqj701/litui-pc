import React from 'react';
import styled from 'styled-components';
import expiredImgUrl from '../../../assets/images/expired.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

function Expired() {
  return (
    <Wrapper>
      <img src={expiredImgUrl} alt="已过期" width="375px" height="270px" />
      <p>账号已过期，请联系客服。</p>
      <p>400-618-0177</p>
    </Wrapper>
  );
}

export default Expired;

