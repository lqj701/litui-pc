import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { toMoney } from '../../utils/utils';

export default class OrderProduct extends PureComponent {
  static propTypes = {
    products: PropTypes.any,
    totalCount: PropTypes.any,
    totalPrice: PropTypes.any
  };

  render() {
    const columns = [
      {
        title: '商品',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '单价(元)',
        dataIndex: 'price',
        key: 'price',
        render: text => toMoney(text)
      },
      {
        title: '数量',
        dataIndex: 'count',
        key: 'count'
      },
      {
        title: '小计(元)',
        dataIndex: 'total',
        key: 'total',
        render: (text, record) => toMoney(record.price * record.count)
      }
    ];

    const { products, totalCount, totalPrice } = this.props;

    const dataSource = products.map((product, key) => {
      return {
        key: key,
        name: product.ecProduct.ecProductName,
        price: product.ecGoods.price,
        count: product.orderItem.count
      };
    });

    const Footer = () => (
      <div style={{ textAlign: 'right', fontWeight: 900 }}>
        共{totalCount}件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 总计{toMoney(
          totalPrice
        )}
      </div>
    );

    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        footer={Footer}
      />
    );
  }
}
