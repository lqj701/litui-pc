import React from 'react';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

export function FormName({ field, initialValue, getFieldDecorator, ...other }) {
  return (
    <FormItem {...other} label="商品名称">
      {getFieldDecorator(field, {
        initialValue: initialValue,
        rules: [
          { required: true, message: '请你输入商品名称!' },
          { max: 20, message: '商品名称超出限制' }
        ]
      })(<Input maxLength="20" />)}
    </FormItem>
  );
}

export default FormName;
