import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, message } from 'antd';
const FormItem = Form.Item;

import Deliver from '../Deliver';
import { DELIVER } from '../../utils/utils';

import styled from 'styled-components';
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

export class ModifyDeliver extends Component {
  static propTypes = {
    id: PropTypes.any.isRequired,
    form: PropTypes.object,
    logistic: PropTypes.any,
    updateOrderDeliver: PropTypes.any,
    onSubmitSuccess: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  updateDeliver(values) {
    const logisticName = DELIVER[values.logisticWay];

    this.props
      .updateOrderDeliver({
        logisticWay: values.logisticWay,
        logisticNum: values.logisticNum,
        needed: values.needed,
        logisticName,
        orderNum: this.props.id
      })
      .then(action => {
        if (action.payload.code === 0) {
          const { onSubmitSuccess } = this.props;
          onSubmitSuccess && onSubmitSuccess();

          message.success('发货成功');
          this.setState({
            visible: false
          });
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
      if (!fieldsValue['needed']) {
        const values = {
          ...fieldsValue,
          needed: false
        };

        this.updateDeliver(values);
      } else if (!err) {
        this.updateDeliver(fieldsValue);
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const { visible } = this.state;
    const { logistic } = this.props;

    return (
      <span>
        <a onClick={this.showModal}>发货 </a>
        {visible && (
          <Modal
            width={600}
            visible={visible}
            title="商品发货"
            okText="确认"
            cancelText="取消"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <FormItem {...formItemLayout} extra="收货人信息" />
            <FormItem {...formItemLayout} label="收货人">
              {logistic.consignee}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号">
              {logistic.phone}
            </FormItem>
            <FormItem {...formItemLayout} label="收货地址">
              {logistic.province}
              {logistic.city}
              {logistic.area}
              {logistic.address}
            </FormItem>
            <Divider />

            <Deliver
              defaultNeeded
              disabled={false}
              dataSource={logistic}
              status={1}
              formItemLayout={formItemLayout}
              {...this.props}
            />
          </Modal>
        )}
      </span>
    );
  }
}

export default Form.create()(ModifyDeliver);
