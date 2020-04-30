import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, Form, Input } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;

import Deliver from '../../components/Deliver';
import OrderPrice from '../../components/OrderPrice';

import styled from 'styled-components';
const Divider = styled.div`
  border-top: 1px dashed #ddd;
  height: 1px;
  margin: 40px 0;
`;
const StyledCard = styled(Card)`
  margin: 10px 0 15px 0;
`;

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

export default class OrderInfo extends Component {
  static propTypes = {
    data: PropTypes.any,
    form: PropTypes.any
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { data } = this.props;
    const { getFieldDecorator } = this.props.form;

    if (!data) {
      return <StyledCard title="订单信息" loading />;
    }

    return (
      <StyledCard title="订单信息">
        <Row>
          <Col span={12}>
            {data && <OrderPrice dataSource={data.order} {...this.props} />}
          </Col>

          <Col span={12}>
            <FormItem extra="买家信息" />
            <FormItem {...formItemLayout} label="买家名称">
              <Input value={data && data.logistic.consignee} disabled />
            </FormItem>
            <FormItem {...formItemLayout} label="买家手机号">
              <Input value={data && data.logistic.phone} disabled />
            </FormItem>
            <FormItem {...formItemLayout} label="买家收货地址">
              <Input
                value={
                  data &&
                  data.logistic.province +
                    data.logistic.city +
                    data.logistic.address
                }
                disabled
              />
            </FormItem>
          </Col>
        </Row>

        <Divider />

        <Row>
          <Col span={12}>
            {data && (
              <Deliver
                defaultNeeded={data.logistic.needed}
                disabled={
                  data.order.status === 1 || data.order.status === 2
                    ? false
                    : true
                }
                dataSource={data.logistic}
                status={1}
                formItemLayout={formItemLayout}
                {...this.props}
              />
            )}
          </Col>
          <Col span={12}>
            <FormItem extra="备注信息" />
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remark', {
                initialValue: data && data.order.remark
              })(
                <TextArea disabled={data.order.status === 3 ? true : false} />
              )}
            </FormItem>
          </Col>
        </Row>
      </StyledCard>
    );
  }
}
