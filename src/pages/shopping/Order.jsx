import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import {
  fetchOrders,
  searchOrders,
  updateOrderPrice,
  updateOrderDeliver,
  updateOrderLogistic
} from '../../actions/order';
import { Card } from 'antd';

import OrderTable from '../../containers/order';
import OrderSearch from '../../containers/order/OrderSearch';
import OrderTabs from '../../containers/order/OrderTabs';

const Header = styled.h1`
  position: relative;
  display: flex;
  margin-bottom: 0;
  font-size: 20px;
  height: 45px;
  line-height: 45px;
`;

const Title = styled.span`
  padding-right: 60px;
`;

export class Order extends Component {
  static propTypes = {
    form: PropTypes.object,
    fetchOrders: PropTypes.any,
    searchOrders: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.state = {
      TabIndex: '-1'
    };

    this.page = 1;
    this.row = 20;
    this.search = undefined;
  }

  componentDidMount() {
    this.props.fetchOrders({
      page: this.page,
      row: this.row
    });
  }

  handleSearchSubmit = values => {
    this.setState({ TabIndex: values.status });

    this.search = {
      orderNum: values.orderNum ? values.orderNum : undefined,
      phone: values.phone ? values.phone : undefined,
      status: values.status === '-1' ? undefined : values.status,
      goodsName: values.goodsName ? values.goodsName : undefined,
      beginAt: values.beginAt,
      endAt: values.endAt,
      page: this.page,
      row: this.row
    };

    this.props.searchOrders(this.search);
  };

  handlePagination = (page, pageSize) => {
    const { TabIndex } = this.state;

    // console.error(this.search);
    let params = {};
    if (this.search) {
      params = {
        ...this.search,
        status: TabIndex === '-1' ? undefined : TabIndex,
        page: page,
        row: pageSize
      };
    } else {
      params = {
        status: TabIndex === '-1' ? undefined : TabIndex,
        page: page,
        row: pageSize
      };
    }

    this.props.searchOrders(params);
  };

  handleTabChange = TabIndex => {
    let params = {};
    if (this.search) {
      params = {
        ...this.search,
        status: TabIndex === '-1' ? undefined : TabIndex,
        page: this.page,
        row: this.row
      };
    } else {
      params = {
        status: TabIndex === '-1' ? undefined : TabIndex,
        page: this.page,
        row: this.row
      };
    }

    this.props.searchOrders(params);

    this.setState({ TabIndex: TabIndex });
  };

  render() {
    const { TabIndex } = this.state;

    return (
      <div>
        <Header>
          <Title>订单管理</Title>
        </Header>
        <Card>
          <OrderSearch onSubmit={this.handleSearchSubmit} />

          <OrderTabs activeKey={TabIndex} onChange={this.handleTabChange} />

          <OrderTable
            TabIndex={this.state.TabIndex}
            onPagination={this.handlePagination}
            {...this.props}
          />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    order: { fetchOrders }
  } = state;

  return fetchOrders;
};

export default connect(
  mapStateToProps,
  {
    fetchOrders,
    searchOrders,
    updateOrderPrice,
    updateOrderDeliver,
    updateOrderLogistic
  }
)(withRouter(Order));
