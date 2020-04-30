import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal, Input, Form, message } from 'antd';
const FormItem = Form.Item;

import OrderProduct from './OrderProduct';

const Divider = styled.div`
  border-top: 1px dashed #ddd;
  height: 1px;
  margin: 40px 0;
`;

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 18 }
  }
};

export class ModifyPrice extends Component {
  static propTypes = {
    id: PropTypes.any.isRequired,
    form: PropTypes.object,
    products: PropTypes.any,
    actualMoney: PropTypes.any,
    sum: PropTypes.any,
    count: PropTypes.any,
    updateOrderPrice: PropTypes.any,
    onSubmit: PropTypes.any,
    onSubmitSuccess: PropTypes.func
  };
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.actualMoney = props.actualMoney;
  }

  updatePrice(values) {
    this.props
      .updateOrderPrice({
        actualMoney: values.actualMoney * 100,
        orderNum: this.props.id
      })
      .then(action => {
        if (action.payload.code === 0) {
          const { onSubmitSuccess } = this.props;
          onSubmitSuccess && onSubmitSuccess();

          message.success('修改成功');
          this.setState({
            visible: false
          });
        } else if (action.payload.code === 14009) {
          message.error('实付金额不能为0');
        } else {
          message.error('系统异常');
        }
      });
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        this.updatePrice(fieldsValue);
      }
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  handleActualChange = ({ target: { value } }) => {
    this.actualMoney = value;
  };

  render() {
    const { visible } = this.state;
    const { products, actualMoney, sum, count } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <span>
        <a onClick={this.showModal}>修改价格</a>
        {visible && (
          <Modal
            width={600}
            visible={visible}
            title="修改价格"
            okText="确认"
            cancelText="取消"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <FormItem {...formItemLayout} label="订单总价">
              <Input defaultValue={sum / 100} prefix={'¥'} disabled />
            </FormItem>

            <FormItem {...formItemLayout} label="实付金额">
              {getFieldDecorator('actualMoney', {
                initialValue: actualMoney / 100,
                rules: [
                  { required: true, message: '请你输入金额' },
                  {
                    pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                    message: '请输入正确的金额'
                  }
                ]
              })(<Input prefix={'¥'} />)}
            </FormItem>

            <Divider />

            <OrderProduct
              totalCount={count}
              totalPrice={sum}
              products={products}
            />
          </Modal>
        )}
      </span>
    );
  }
}

export default Form.create()(ModifyPrice);
