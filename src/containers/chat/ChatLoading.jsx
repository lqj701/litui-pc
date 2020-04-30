import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { getCustomerInfo } from '../../actions/customer';
import { fetchCustomerImAccount } from '../../actions/chat';
import { Modal } from 'antd';

/**
 * 聊天对话框loading页面
 * 在进入聊天页面前，必须等待接口数据返回
 */
const Wrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;
const rotate360 = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;
export const LoadingIcon = styled.div`
  display: inline-block;
  width: 36px;
  height: 36px;
  background-size: 100%;
  background: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")
    no-repeat 50%;
  animation: ${rotate360} 1s steps(12, end) infinite;
  margin: 0.2rem 0;
`;

class ChatLoading extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    chat: PropTypes.object,
    getCustomerInfo: PropTypes.func,
    fetchCustomerImAccount: PropTypes.func,
    customerImAccounts: PropTypes.any
  };

  componentDidMount() {
    const { params } = this.props.match;
    this.props
      .getCustomerInfo({ customer_wx_user_id: params.id })
      .then(action => {
        if (action.payload.code === 101123) {
          Modal.error({
            title: '提示',
            content: '授权已过期'
          });
        } else if (action.payload.code === 500) {
          Modal.error({
            title: '提示',
            content: '非法操作'
          });
        } else {
          this.props.fetchCustomerImAccount({
            orgId: AppConf.orgId,
            userIdOrOpenid: action.payload.data.openid
          });
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    const { url } = this.props.match;

    if (
      // nextProps.chat.contacts.length > 0 &&
      nextProps.customerImAccounts.code === 0
    ) {
      // 没有合适的条件
      setTimeout(() => {
        this.props.history.push(`${url}/chat`);
      }, 1000);
    }
  }

  render() {
    return (
      <Wrapper>
        <LoadingIcon />
        <div>正在连接中...</div>
      </Wrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    customer: state.customer,
    chat: state.chat,
    customerImAccounts: state.chat.customerImAccounts
  };
}
export default connect(
  mapStateToProps,
  { getCustomerInfo, fetchCustomerImAccount }
)(withRouter(ChatLoading));
