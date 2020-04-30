import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  updateProduct,
  fetchProduct,
  deleteProductGood
} from '../../actions/product';
import { fetchShopConfig } from '../../actions/setting';
import { fetchUploadInfo } from '../../actions/upload';
import { message } from 'antd';
import Opera from '../../containers/shopping/opera';

export class ProductEditor extends Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    fetchProduct: PropTypes.func,
    updateProduct: PropTypes.func,
    fetchShopConfig: PropTypes.func,
    fetchUploadInfo: PropTypes.func
  };

  handleOperaSubmit = values => {
    const {
      match: {
        params: { id }
      }
    } = this.props;

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
        if (list.price && list.value && list.ecGoodsImage) {
          return list;
        }
      });

    const params = {
      id,
      name,
      onSale,
      multiSpecification,
      canBuy,
      ecGoodsList: list,
      showImages,
      detailImages
    };
    console.error('send => ', params);

    this.props.updateProduct(params).then(action => {
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

  componentDidMount() {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    this.props.fetchProduct(id);
  }

  render() {
    return (
      <Opera type="editor" onSubmit={this.handleOperaSubmit} {...this.props} />
    );
  }
}

const mapStateToProps = state => {
  const {
    product: { fetchProduct },
    upload: { fetchUploadInfo },
    setting: { fetchShopConfig }
  } = state;

  return { ...fetchProduct, ...fetchUploadInfo, shopConfig: fetchShopConfig };
};

export default connect(
  mapStateToProps,
  {
    fetchProduct,
    updateProduct,
    fetchUploadInfo,
    fetchShopConfig,
    deleteProductGood
  }
)(withRouter(ProductEditor));
