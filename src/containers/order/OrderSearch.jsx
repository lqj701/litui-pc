import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Input, Button, DatePicker, Select } from 'antd';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

export class OrderSearch extends Component {
  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func
  };

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue,
          beginAt: fieldsValue['timer']
            ? fieldsValue['timer'][0].format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          endAt: fieldsValue['timer']
            ? fieldsValue['timer'][1].format('YYYY-MM-DD HH:mm:ss')
            : undefined
        };

        const { onSubmit } = this.props;
        onSubmit && onSubmit(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };

    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label="订单编号" {...formItemLayout}>
              {getFieldDecorator(`orderNum`, {
                rules: [
                  { pattern: /^[0-9]*$/, message: '请输入正确的订单编号' }
                ]
              })(<Input placeholder="请输入订单编号" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="手机号" {...formItemLayout}>
              {getFieldDecorator(`phone`, {
                rules: [
                  {
                    pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                    message: '请输入正确的手机号码'
                  }
                ]
              })(<Input placeholder="请输入手机号" maxLength="11" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="下单时间" {...formItemLayout}>
              {getFieldDecorator(`timer`)(
                <RangePicker format="YYYY-MM-DD HH:mm:ss" />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="订单状态" {...formItemLayout}>
              {getFieldDecorator(`status`, {
                initialValue: '-1'
              })(
                <Select placeholder="请选择">
                  <Option value="-1">全部</Option>
                  <Option value="0">待付款</Option>
                  <Option value="1">待发货</Option>
                  <Option value="2">已发货</Option>
                  <Option value="3">已关闭</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="商品名称" {...formItemLayout}>
              {getFieldDecorator(`goodsName`, {
                rules: [{ max: 20, message: '商品名称超出限制' }]
              })(<Input placeholder="请输入商品名称" maxLength="20" />)}
            </FormItem>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(OrderSearch);
