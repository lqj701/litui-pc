import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/lib/form';
import 'antd/lib/form/style/css';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/css';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

function AuditForm({ form }) {
  const { getFieldDecorator } = form;

  return (
    <Form>
      <Form.Item {...formItemLayout} label="小程序名称">
        {getFieldDecorator('title', {
          rules: [{ required: true, message: '请输入小程序名称！' }],
        })(<Input />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="小程序标签">
        {getFieldDecorator('tag', {
          rules: [{ required: true, message: '请输入小程序名称！' }],
        })(<Input />)}
      </Form.Item>
    </Form>
  );
}

AuditForm.propTypes = {
  form: PropTypes.object.isRequired,
};

export default Form.create()(AuditForm);
