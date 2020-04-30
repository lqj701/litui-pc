import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import OrderProduct from '../../components/Order/OrderProduct';

export default class ShoppingInfo extends Component {
  static propTypes = {
    data: PropTypes.any
  };

  render() {
    const { data } = this.props;

    return (
      <Card title="商品信息">
        {data ? (
          <OrderProduct
            totalCount={data.order.count}
            totalPrice={data.order.sum}
            products={data.orderItemList}
          />
        ) : null}
      </Card>
    );
  }
}
