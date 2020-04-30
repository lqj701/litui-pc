import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Pagination } from 'antd';

import ModifyPrice from '../../components/Order/ModifyPrice';
import ModifyLogistic from '../../components/Order/ModifyLogistic';
import ModifyDeliver from '../../components/Order/ModifyDeliver';
import { Link } from '../../components/Router';
import { formatDate, toMoney } from '../../utils/utils';

import styled from 'styled-components';

const Items = styled.div`
  border: 1px solid #ddd;
  margin: 10px 0;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const ItemsHeader = styled.div`
  background-color: rgba(74, 140, 242, 0.1);
  padding: 5px;
  color: #000;
  font-size: 12px;
`;

const ItemsBody = styled(Row)`
  padding: 10px 5px;
  font-size: 14px;
`;

const TableHeader = styled(Row)`
  background-color: #4a8cf2;
  color: #fff;
  font-size: 14px;
  padding: 16px 16px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const TipsStyled = styled.div`
  font-size: 16px;
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  position: relative;
  padding: 16px 16px;
  background: #fff;
`;

export default class Index extends Component {
  static propTypes = {
    history: PropTypes.object,
    data: PropTypes.any,
    fetchOrders: PropTypes.any,
    searchOrders: PropTypes.any,
    onPagination: PropTypes.any,
    TabIndex: PropTypes.any,
    pageSize: PropTypes.any,
    isFetching: PropTypes.any
  };

  static defaultProps = {
    data: []
  };

  constructor(props) {
    super(props);

    this.row = 20;

    this.state = {
      page: 1
    };
  }

  getOrders(status) {
    this.props.searchOrders({
      status: status,
      page: this.state.page,
      row: this.row
    });
  }

  getStatusName(index) {
    const status = ['待付款', '待发货', '已发货', '已关闭', '已完成'];
    return status[index];
  }

  handlePriceSubmitSuccess = () => {
    const status = this.props.TabIndex == 0 ? 0 : undefined;
    this.getOrders(status);
  };

  handleDeliverSuccess = () => {
    const status = this.props.TabIndex != -1 ? this.props.TabIndex : undefined;
    this.getOrders(status);
  };

  handleLogisticSubmitSuccess = () => {
    const status = this.props.TabIndex != -1 ? this.props.TabIndex : undefined;
    this.getOrders(status);
  };

  handlePaginationChange = (page, pageSize) => {
    this.setState({ page });
    const { onPagination } = this.props;
    onPagination && onPagination(page, pageSize);
  };

  render() {
    const { data, isFetching, pageSize } = this.props;

    const formatOrderDate = (title, timestamp) => {
      if (timestamp) {
        return title + formatDate(timestamp);
      }
    };

    return (
      <div>
        <TableHeader>
          <Col span={6}>
            <Row>
              <Col span={12}>商品</Col>
              <Col span={12}>单价/数量</Col>
            </Row>
          </Col>
          <Col span={4}>总计</Col>
          <Col span={4}>实付金额</Col>
          <Col span={4}>收货人/手机号</Col>
          <Col span={2}>状态</Col>
          <Col span={4}>操作</Col>
        </TableHeader>
        {!data.length && !isFetching && <TipsStyled>暂无数据</TipsStyled>}
        {isFetching && <TipsStyled>数据加载中</TipsStyled>}
        {data.map((orders, key) => {
          return (
            <Items key={key}>
              <ItemsHeader>
                订单编号：
                <Link to={`order/detail/${orders.order.orderNum}`}>
                  {orders.order.orderNum}
                </Link>
                {formatOrderDate('  下单时间：', orders.order.createdAt)}
                {formatOrderDate('  支付时间：', orders.order.paidAt)}
                {formatOrderDate('  完成时间：', orders.order.complatedAt)}
              </ItemsHeader>
              <ItemsBody>
                <Col span={6}>
                  {orders.orderItemList.map((list, key) => {
                    return (
                      <Row gutter={16} key={key}>
                        <Col span={12}>
                          {list.ecProduct.ecProductName}({list.value})
                        </Col>
                        <Col span={12}>
                          {toMoney(list.ecGoods.price)}/{list.orderItem.count}
                        </Col>
                      </Row>
                    );
                  })}
                </Col>
                <Col span={4}>{toMoney(orders.order.sum)}</Col>
                <Col span={4}>{toMoney(orders.order.actualMoney)}</Col>
                <Col span={4}>
                  {orders.logistic.consignee}/{orders.logistic.phone}
                </Col>
                <Col span={2}>{this.getStatusName(orders.order.status)}</Col>
                <Col
                  span={4}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around'
                  }}
                >
                  {orders.order.status === 0 ? (
                    <ModifyPrice
                      products={orders.orderItemList}
                      actualMoney={orders.order.actualMoney}
                      sum={orders.order.sum}
                      count={orders.order.count}
                      id={orders.order.orderNum}
                      onSubmitSuccess={this.handlePriceSubmitSuccess}
                      {...this.props}
                    />
                  ) : null}
                  {orders.order.status === 1 ? (
                    <ModifyDeliver
                      logistic={orders.logistic}
                      id={orders.order.orderNum}
                      onSubmitSuccess={this.handleDeliverSuccess}
                      {...this.props}
                    />
                  ) : null}
                  {orders.order.status === 2 ? (
                    <ModifyLogistic
                      logistic={orders.logistic}
                      id={orders.order.orderNum}
                      onSubmitSuccess={this.handleLogisticSubmitSuccess}
                      {...this.props}
                    />
                  ) : null}

                  <Link to={`${this.props.match.url}/detail/${orders.order.orderNum}`}>
                    查看订单
                  </Link>
                </Col>
              </ItemsBody>
            </Items>
          );
        })}

        <Pagination
          showQuickJumper
          current={this.state.page}
          pageSize={this.row}
          total={pageSize}
          showTotal={total => `共 ${total} 条`}
          onChange={this.handlePaginationChange}
          style={{ float: 'right' }}
        />
      </div>
    );
  }
}
