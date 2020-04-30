import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import {
  fetchOrderDetail,
  updateOrderLogistic,
  updateOrderPrice
} from '../../actions/order';
import OrderInfo from '../../containers/order/OrderInfo';
import ShoppingInfo from '../../containers/order/ShoppingInfo';

import { Form, Button, message } from 'antd';

const Header = styled.h1`
  position: relative;
  display: flex;
  margin-bottom: 0;
  font-size: 20px;
`;

const Title = styled.span`
  padding-right: 60px;
`;

export class OrderDetail extends Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    fetchOrderDetail: PropTypes.func,
    updateOrderPrice: PropTypes.func,
    updateOrderLogistic: PropTypes.func
  };

  updatePrice(values) {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    this.props
      .updateOrderPrice({
        actualMoney: values.actualMoney * 100,
        remark: values.remark,
        orderNum: id
      })
      .then(action => {
        if (action.payload.code === 0) {
          this.updateLogistic(values);
        } else {
          message.success('操作失败！');
        }
      });
  }

  updateLogistic(values) {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    this.props
      .updateOrderLogistic({
        logisticWay: values.logisticWay,
        logisticNum: values.logisticNum,
        needed: values.needed,
        orderNum: id
      })
      .then(action => {
        if (action.payload.code === 0) {
          message.success('操作成功！');
          this.props.history.goBack();
        } else {
          message.success('操作失败！');
        }
      });
  }

  handleCancelClick = () => {
    this.props.history.goBack();
  };

  handleSaveClick = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.updatePrice(values);
      }
    });
  };

  componentDidMount() {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    this.props.fetchOrderDetail(id);
  }

  render() {
    return (
      <div>
        <Header>
          <Title>订单详情</Title>
          <span style={{ flex: '1 1 1e-09px' }} />
          <Button
            onClick={this.handleCancelClick}
            style={{ marginRight: '10px' }}
          >
            取消
          </Button>
          <Button type="primary" onClick={this.handleSaveClick}>
            保存
          </Button>
        </Header>
        <Form>
          <OrderInfo {...this.props} />
          <ShoppingInfo {...this.props} />
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    order: { fetchOrderDetail }
  } = state;

  return { ...fetchOrderDetail };
};

export default connect(
  mapStateToProps,
  { fetchOrderDetail, updateOrderPrice, updateOrderLogistic }
)(withRouter(Form.create()(OrderDetail)));
