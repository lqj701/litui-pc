import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DELIVER } from '../../utils/utils';
import { Input, Form, Select, Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export default class index extends Component {
  static propTypes = {
    form: PropTypes.any,
    status: PropTypes.any,
    dataSource: PropTypes.any,
    defaultNeeded: PropTypes.bool,
    disabled: PropTypes.bool,
    formItemLayout: PropTypes.any
  };

  static defaultProps = {
    // 默认需要物流
    defaultNeeded: true,
    // 禁用
    disabled: false,
    dataSource: {
      needed: false,
      logisticWay: undefined,
      logisticNum: undefined
    },
    formItemLayout: {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 }
      }
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      isDeliver: this.getNeedeProps(props),
      radioChange: false,
      defaultNeeded: props.defaultNeeded
    };
  }

  getNeedeProps(props) {
    if (props.defaultNeeded) {
      return true;
    }

    return false;
  }

  handleRadioChange = ({ target: { value } }) => {
    this.setState({ isDeliver: !!value, radioChange: true });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataSource, formItemLayout, disabled } = this.props;
    const { defaultNeeded } = this.state;

    return (
      <div>
        <FormItem extra="物流信息" />
        <FormItem {...formItemLayout} label="发货方式">
          {getFieldDecorator('needed', {
            initialValue: defaultNeeded
          })(
            <RadioGroup onChange={this.handleRadioChange} disabled={disabled}>
              <Radio value={true}>需要物流</Radio>
              <Radio value={false}>无需物流</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="物流方式">
          {getFieldDecorator('logisticWay', {
            initialValue: dataSource.logisticWay,
            rules: [
              { required: this.state.isDeliver, message: '请选择物流方式' }
            ]
          })(
            <Select
              placeholder="请选择物流方式"
              style={{ display: 'block' }}
              disabled={!this.state.isDeliver}
            >
              {DELIVER.map((value, key) => {
                return (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="物流单号">
          {getFieldDecorator('logisticNum', {
            initialValue: dataSource.logisticNum,
            rules: [
              { required: this.state.isDeliver, message: '请你输入物流单号' }
            ]
          })(<Input disabled={!this.state.isDeliver} maxLength="30" />)}
        </FormItem>
      </div>
    );
  }
}
