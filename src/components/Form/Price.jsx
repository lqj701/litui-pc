import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

export function Price({ field, price, getFieldDecorator, ...other }) {
  return (
    <FormItem {...other}>
      {getFieldDecorator(field, {
        initialValue: price ? price / 100 : '',
        rules: [
          { required: true, message: '请你输入单价' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '请输入正确的单价'
          }
        ]
      })(<Input prefix={'¥'} />)}
    </FormItem>
  );
}

export default Price;
