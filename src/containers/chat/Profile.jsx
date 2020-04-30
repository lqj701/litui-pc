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

export class Profile extends Component {
  static propTypes = {};

  render() {
    const { customer } = this.props;

    return (
      <Wrapper>
        <Left>
          <Img src={customer.avatar_url} />
        </Left>
        <Center>
          <strong>
            {customer.nickname ? customer.nickname : customer.name}
          </strong>
          <div>备注名：{customer.remark}</div>
          <div>公司名称：{customer.company}</div>
        </Center>
        <Right>
          <div style={{ visibility: 'hidden' }}>电话1:{customer.phone1}</div>
          <div>电话1:{customer.phone1}</div>
          <div>电话2:{customer.phone2}</div>
        </Right>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    customer: state.customer.customer
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
