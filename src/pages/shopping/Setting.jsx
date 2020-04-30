import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import {
  fetchShopConfig,
  updateShopConfig,
  updatePayConfig,
  fetchPayConfig
} from '../../actions/setting';
import Tab from '../../components/Tab';

import { Form, Input, Switch, Button, Card, message, Alert, Modal } from 'antd';
const FormItem = Form.Item;

const StyledCard = styled(Card)`
  height: 80vh;
`;

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 8 },
    sm: { span: 8 }
  }
};

const formSwitchLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 8 },
    sm: { span: 16 }
  }
};

export class Setting extends Component {
  static propTypes = {
    form: PropTypes.object,
    fetchShopConfig: PropTypes.func,
    updateShopConfig: PropTypes.func,
    updatePayConfig: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      enable: true,
      shopName: undefined,
      merchant_id: undefined,
      secret: undefined
    };

    this.tabIndex = 0;
  }

  updateShop(values) {
    this.props
      .updateShopConfig({
        name: values.name,
        enable: values.switch
      })
      .then(action => {
        const status = {
          0: '操作成功！',
          140001: '商城名为空！',
          140007: '存在待发货的订单，不可关闭商城！',
          500: '系统异常！'
        };

        message.success(status[action.payload.code]);
      });
  }

  updatePay(values) {
    this.props
      .updatePayConfig({ merchantId: values.merchantId, secret: values.secret })
      .then(action => {
        if (action.payload.code === 0) {
          message.success('操作成功');
        } else if (action.payload.code === 141111) {
          message.error('该商户支付设置已存在！');
        } else if (action.payload.code === 141110) {
          message.error('商户编号或商户密钥不可为空！');
        } else {
          message.error('系统异常！');
        }
      });
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  handleSaveClick = () => {
    this.props.form.validateFields((err, values) => {
      if (this.tabIndex === 0) {
        if (err && err['name']) {
          return;
        }
        this.updateShop(values);
      } else if (this.tabIndex === 1) {
        if (err && (err['merchantId'] || err['secret'])) {
          return;
        }
        // console.log('success');
        this.updatePay(values);
      }
    });
  };

  handleTabChange = index => {
    this.tabIndex = index;
    if (index) {
      this.props.fetchShopConfig();
    } else {
      this.props.fetchPayConfig();
    }
    this.props.form.resetFields();
  };

  componentDidMount() {
    this.props.fetchShopConfig();
    //
    this.props.fetchPayConfig();

    const {
      match: { path }
    } = this.props;

    if (path === '/shopping/setting/pay') {
      this.setState({ tabIndex: 1 });
    }
  }

  handleSwitchChange = value => {
    if (AppConf.mpType === '2') {
      if (value) {
        Modal.info({
          content: (
            <div>
              启用商城功能前，请务必保证小程序服务类目中包含“商家自营”项，点击这里查看<a target="blank" href="https://www.kancloud.cn/weiwenjia_litui/help/711899">设置指引</a>
            </div>
          )
        });
      }
    }
  };

  handleSwitchClick = () => {
    if (AppConf.mpType !== '2') {
      Modal.info({
        content: (
          <div>
            开启商城需要绑定小程序，若您还未有绑定，请<a href="/wx/1/h5/miniprogram">立即绑定</a>
          </div>
        )
      });
      this.props.form.setFieldsValue({ switch: false })
    }
  }

  render() {
    const { merchant_id, secret } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { enable, shopName } = this.props;

    return (
      <Tab
        title="商城设置"
        extra={
          <Button type="primary" onClick={this.handleSaveClick}>
            保存
          </Button>
        }
        onChange={this.handleTabChange}
      >
        <Tab.Panel title="基础设置">
          <StyledCard>
            <Form>
              <FormItem
                {...formSwitchLayout}
                label="启用商城"
                extra={<div>启用商城功能之后，小程序中“产品”页将被替换为“商城”，关闭商城功能后，将自动启动“产品”页。点击查看：<a href="https://www.kancloud.cn/weiwenjia_litui/help/711895" target="_blank">产品和商品的区别</a></div>}
              >
                {getFieldDecorator('switch', {
                  initialValue: enable,
                  valuePropName: 'checked',
                })(<Switch onChange={this.handleSwitchChange} onClick={this.handleSwitchClick} />)}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="商城名称"
                extra="商城名称将展示在商城页面顶部"
              >
                {getFieldDecorator('name', {
                  initialValue: shopName,
                  rules: [
                    { max: 20, message: '商城名称超出字数限制!' },
                    { required: true, message: '请输入商城名称!' }
                  ]
                })(<Input />)}
              </FormItem>
            </Form>
          </StyledCard>
        </Tab.Panel>
        <Tab.Panel title="支付设置">
          <StyledCard>
            <Alert
              style={{ marginBottom: 20 }}
              message={
                <div>
                  <div>提示：</div>
                  <div>
                    用户在商城内进行支付需先配置微信支付商户信息详情进入<a target="blank" href="https://www.kancloud.cn/weiwenjia_litui/help/711981">如何配置支付</a>查看
                  </div>
                  <div>未设置商户号与商户密钥，用户购买商品时不能支付</div>
                </div>
              }
              type="info"
              showIcon
            />

            <Form>
              <FormItem {...formItemLayout} label="商户号">
                {getFieldDecorator('merchantId', {
                  initialValue: merchant_id,
                  rules: [
                    // { required: true, message: '请输入商户号!' },
                  ]
                })(<Input maxLength="32" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="商户密钥">
                {getFieldDecorator('secret', {
                  initialValue: secret,
                  rules: [
                    // { required: true, message: '请输入商户密钥!' },
                    { len: 32, message: '请输入正确的商户密钥!' }
                    // { max: 32, message: '请输入正确的商户密钥!' }
                  ]
                })(<Input type="password" maxLength="32" />)}
              </FormItem>
            </Form>
          </StyledCard>
        </Tab.Panel>
      </Tab>
    );
  }
}

const mapStateToProps = state => {
  const {
    setting: { fetchShopConfig, fetchPayConfig }
  } = state;

  return { ...fetchShopConfig, ...fetchPayConfig };
};

export default connect(
  mapStateToProps,
  { fetchShopConfig, fetchPayConfig, updateShopConfig, updatePayConfig }
)(Form.create()(withRouter(Setting)));
