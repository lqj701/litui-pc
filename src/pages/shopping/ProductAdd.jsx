import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { addProduct, updateProduct } from '../../actions/product';
import { fetchShopConfig } from '../../actions/setting';

import { fetchUploadInfo } from '../../actions/upload';

import { message } from 'antd';

import Opera from '../../containers/shopping/opera';

export class ProductEditor extends Component {
  static propTypes = {
    history: PropTypes.object,
    addProduct: PropTypes.func,
    fetchUploadInfo: PropTypes.func
  };

  handleOperaSubmit = values => {
    const {
      name,
      onSale,
      canBuy,
      showImages,
      detailImages,
      multiSpecification,
      ecGoodsList
    } = values;

    // 过滤掉空字段数据
    const list =
      ecGoodsList &&
      ecGoodsList.filter(list => {
        if (list.price && list.value) {
          return list;
        }
      });

    const params = {
      name,
      onSale,
      canBuy,
      multiSpecification,
      ecGoodsList: list,
      showImages,
      detailImages
    };

    this.props.addProduct(params).then(action => {
      const status = {
        0: '操作成功',
        140002: '该商品名有误',
        140003: '该商品名称已存在，请重新输入',
        140004: '商品价格不能为0',
        140005: '该商品首页图片为空',
        140006: '参数错误',
        140011: '商品规格字段有误',
        140012: '库存限输入0~999999',
        140014: '商品规格名重复',
        500: '系统异常'
      };

      message.success(status[action.payload.code]);
      if (action.payload.code === 0) {
        this.props.history.goBack();
      }
    });
  };

  componentWillMount() {
    this.props.fetchUploadInfo();
    this.props.fetchShopConfig();
  }

  render() {
    return <Opera onSubmit={this.handleOperaSubmit} {...this.props} />;
  }
}

const mapStateToProps = state => {
  const {
    upload: { fetchUploadInfo },
    setting: { fetchShopConfig }
  } = state;

  return { ...fetchUploadInfo, shopConfig: fetchShopConfig };
};

export default connect(
  mapStateToProps,
  { addProduct, updateProduct, fetchUploadInfo, fetchShopConfig }
)(withRouter(ProductEditor));
