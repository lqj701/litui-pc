import React from 'react';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

function SingleSpec({
  dataSource,
  formItemLayout,
  data,
  form: { getFieldDecorator }
}) {
  return (
    <React.Fragment>
      <FormItem
        {...formItemLayout}
        label="单价"
        extra="价格限输入0.01~9999999.00"
      >
        {getFieldDecorator('price', {
          initialValue: dataSource.price ? dataSource.price / 100 : '',
          rules: [
            { required: true, message: '请你输入单价' },
            {
              pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,9}\.\d{0,2}$|^[1-9]\d{0,9}$/,
              message: '请输入正确的价格'
            }
          ]
        })(<Input prefix={'¥'} maxLength="10" />)}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="库存"
        extra="库存限输入0~999999，库存为0时，会放到“已售罄”的商品列表里，保存后买家看到的商品库存同步更新"
      >
        {getFieldDecorator('totalNum', {
          initialValue: dataSource.remainNum ? dataSource.remainNum : 0,
          rules: [
            {
              required: true,
              message: '请输入库存数'
            },
            {
              pattern: /^\d*$/,
              message: '请输入正确的库存数'
            }
          ]
        })(<Input maxLength="6" />)}
      </FormItem>
    </React.Fragment>
  );
}

export default SingleSpec;
