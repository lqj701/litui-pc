import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Error from '../../../assets/images/error.png';

const Wrapper = styled.div`
  flex: 1;
  align-self: center;
  text-align: center;
  margin-top: 150px;
`;

const Text = styled.div`
  font-size: 18px;
  margin: 60px 0 0 0;
`;

const Box = styled.div`
  border: 1px solid #f3f3f3;
  height: 200px;
  width: 600px;
  margin: auto;
`;

const code = {
  2009: '此企业已被其他小程序授权使用。',
  2010: '此企业已被授权使用，不允许更换企业再次授权',
};

class BindResult extends Component {
  render() {
    return (
      <Wrapper>
        <Box>
          <img style={{ marginTop: '-30' }} width="50px" src={Error} alt="" />
          <Text>{code[this.props.code]}</Text>
        </Box>
      </Wrapper>
    );
  }
}

BindResult.propTypes = {
  message: PropTypes.string,
  code: PropTypes.number,
};

export default BindResult;
