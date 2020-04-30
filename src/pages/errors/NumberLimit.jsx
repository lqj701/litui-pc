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

function NumberLimit() {
  return (
    <Wrapper>
      <img src={numberLimitImgUrl} alt="超出员工数量限制" width="375px" height="270px" />
      <p>超出使用工号上限，请联系你的管理员升级系统版本。</p>
    </Wrapper>
  );
}

export default NumberLimit;
