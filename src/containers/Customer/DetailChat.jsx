import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  font-size: 14px;
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
`;

const Left = styled.div`
  width: 48px;
`;

const Center = styled.div`
  flex: 1;
  line-height: 24px;
`;

const Right = styled.div`
  flex: 1;
  line-height: 24px;
`;

const Img = styled.img`
  width: 32px;
  height: 32px;
`;

export class DetailChat extends Component {
  static propTypes = {
    prop: PropTypes
  };

  render() {
    return (
      <Wrapper>
        <Left>
          <Img
            src="http://p.qlogo.cn/bizmail/jT9wbPW2yuKeolOibh6rp7zEhp6oEbTKSwOxPpib3uqnKoiaJQB8K5bug/100"
            alt=""
          />
        </Left>
        <Center>
          <strong>备注名：</strong>
          <div>公司名称：</div>
          <div>备注名：</div>
        </Center>
        <Right>
          <div>备注名：</div>
          <div>备注名：</div>
          <div>公司名称：</div>
        </Right>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailChat);
