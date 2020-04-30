import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Input, Form } from 'antd';
const FormItem = Form.Item;

export default class index extends Component {
  static propTypes = {
    form: PropTypes.any,
    dataSource: PropTypes.any
  };

  static defaultProps = {
    dataSource: {
      orderNum: undefined,
      status: undefined,
      sum: undefined,
      actualMoney: undefined
    }
  };

  constructor(props) {
    super(props);

    this.state = {};

    this.percent = 100;
  }

  getStatusName(index) {
    const status = ['待付款', '待发货', '已发货', '已关闭', '已完成'];
    return status[index];
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 }
      }
    };

    const { getFieldDecorator } = this.props.form;
    const { dataSource } = this.props;

    const disabled = () => {
      if (dataSource.status === 0) {
        return false;
      }

      return true;
    };

    return (
      <div>
        <FormItem extra="订单信息" />
        <FormItem {...formItemLayout} label="订单编号">
          <Input value={dataSource.orderNum} disabled />
        </FormItem>
        <FormItem {...formItemLayout} label="订单状态">
          <Input value={this.getStatusName(dataSource.status)} disabled />
        </FormItem>
        <FormItem {...formItemLayout} label="订单总价">
          <Input prefix={'¥'} value={dataSource.sum / 100} disabled />
        </FormItem>
        <FormItem {...formItemLayout} label="实付金额">
          {getFieldDecorator('actualMoney', {
            initialValue: dataSource.actualMoney / 100,
            rules: [
              { required: true, message: '请你输入单价' },
              {
                pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                message: '请输入正确的单价'
              }
            ]
          })(<Input prefix={'¥'} disabled={disabled()} />)}
        </FormItem>
      </div>
    );
  }
}
