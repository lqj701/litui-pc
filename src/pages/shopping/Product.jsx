import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tab from '../../components/Tab';
import {
  fetchProducts,
  saleProduct,
  searchProducts,
  checkUnfinishedOrder,
  deleteProduct
} from '../../actions/product';
import { fetchShopConfig } from '../../actions/setting';
import { Button, Icon, Modal } from 'antd';
import Shopping from '../../containers/shopping';

export class Product extends Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    fetchShopConfig: PropTypes.func,
    fetchProducts: PropTypes.func
  };

  // 商城开启状态
  isShopOpen = true;

  handleAddClick = () => {
    const self = this;
    if (!this.isShopOpen) {
      Modal.confirm({
        title: '开启商城后才能添加商品，是否立即去开启商城',
        onOk() {
          self.props.history.push(`/shopping/setting`);
        }
      });
    } else {
      this.props.history.push(`${this.props.match.url}/add`);
    }
  };

  getProducts(onSale) {
    const params = {
      page: 1,
      row: 20
    };

    switch (onSale) {
      case 0:
        params.onSale = true;
        break;
      case 1:
        params.onSale = true;
        params.sellOut = true;
        break;
      case 2:
        params.onSale = false;
        break;
    }

    return this.props.fetchProducts(params);
  }

  componentDidMount() {
    this.getProducts(0);
    this.props.fetchShopConfig().then(action => {
      this.isShopOpen = action.payload.data.enable;
    });
  }

  handleTabChange = index => {
    this.getProducts(index);
  };

  render() {
    return (
      <Tab
        title="商品管理"
        extra={
          <Button type="primary" onClick={this.handleAddClick}>
            <Icon type="plus" />
            添加商品
          </Button>
        }
        onChange={this.handleTabChange}
      >
        <Tab.Panel title="已上架">
          <Shopping type={1} {...this.props} />
        </Tab.Panel>
        <Tab.Panel title="已售罄">
          <Shopping type={2} {...this.props} />
        </Tab.Panel>
        <Tab.Panel title="未上架">
          <Shopping type={0} {...this.props} />
        </Tab.Panel>
      </Tab>
    );
  }
}

const mapStateToProps = state => {
  return state.product.fetchProducts;
};

export default connect(
  mapStateToProps,
  {
    fetchProducts,
    saleProduct,
    searchProducts,
    checkUnfinishedOrder,
    deleteProduct,
    fetchShopConfig
  }
)(withRouter(Product));
