import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tab from '../../components/Tab';

import { Form, Input, Switch, Button, Card, message } from 'antd';
const FormItem = Form.Item;

const StyledCard = styled(Card)`
  height: 80vh;
`;

export class ShopConfig extends Component {
  static propTypes = {
    form: PropTypes.object,
    fetchShopConfig: PropTypes.func,
    updateShopConfig: PropTypes.func,
    updatePayConfig: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      enable: props.enable || true,
      shopName: props.shopName || undefined,
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
        if (action.payload.code === 0) {
          message.success('操作成功！');
        } else if (action.payload.code === 140001) {
          message.error('商城名为空！');
        } else if (action.payload.code === 140007) {
          message.error('无法关闭商城、存在未完成订单！');
        } else {
          message.error('系统异常！');
        }
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
        this.updateShop(values);
      } else if (this.tabIndex === 1) {
        this.updatePay(values);
      }

      this.props.form.resetFields();
    });
  };

  handleTabChange = index => {
    this.tabIndex = index;
  };

  componentDidMount() {
    this.props.fetchShopConfig();
    //
    this.props.fetchPayConfig();
  }

  render() {
    const { enable, shopName } = this.state;
    const { getFieldDecorator } = this.props.form;

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

    return (
      <Form>
        <FormItem {...formItemLayout} label="启用商城">
          {getFieldDecorator('switch', {
            initialValue: enable,
            valuePropName: 'checked'
          })(<Switch />)}
        </FormItem>
        <FormItem {...formItemLayout} label="商城名称">
          {getFieldDecorator('name', {
            initialValue: shopName,
            rules: [
              { max: 20, message: '商城名称超出字数限制!' },
              { required: true, message: '请输入商品名称!' }
            ]
          })(<Input />)}
        </FormItem>
      </Form>
    );
  }
}

export default ShopConfig;
