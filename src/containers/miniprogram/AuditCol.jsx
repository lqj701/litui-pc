import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { codeCommit, auditStatus } from '../../actions/miniprogram';
import Col from 'antd/lib/col';
import 'antd/lib/col/style/css';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import Modal from 'antd/lib/modal';
import 'antd/lib/modal/style/css';
import message from 'antd/lib/message/index';
import 'antd/lib/message/style/css';
import AuditForm from './AuditForm';

class AuditCol extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      confirmLoading: false,
    };

    this.handleAuditBtnClick = this.handleAuditBtnClick.bind(this);
    this.handleModalOk = this.handleModalOk.bind(this);
    this.handleModalCancel = this.handleModalCancel.bind(this);
    this.bindFormRef = this.bindFormRef.bind(this);
  }

  bindFormRef(ref) {
    this.formRef = ref;
  }

  handleAuditBtnClick() {
    this.setState({ modalVisible: true });
  }

  handleModalOk() {
    const form = this.formRef;

    form.validateFields((err, values) => {
      if (err) return;

      this.setState({ confirmLoading: true });

      this.props
        .codeCommit({
          orgId: AppConf.orgId,
          title: values.title,
          tag: values.tag,
        })
        .then(act => {
          if (!act.payload || act.payload.code !== 0) {
            message.error('模板提交失败，请重新提交！', 5);
            this.setState({ confirmLoading: false });
            return;
          }

          const code = {
            40013: 'appid或open_appid无效。',
            89000: '该公众号/小程序已经绑定了开放平台帐号',
            89001: 'Authorizer与开放平台帐号主体不相同',
            89003: '该开放平台帐号并非通过api创建，不允许操作',
            89004: '该开放平台帐号所绑定的公众号/小程序已达上限（100个）',
            85013: '无效的自定义配置',
            85014: '无效的模版编号',
            85043: '模版错误',
            85044: '代码包超过大小限制',
            85045: 'ext_json有不存在的路径',
            85046: 'tabBar中缺少path',
            85047: 'pages字段为空',
            85048: 'ext_json解析失败',
            86000: '不是由第三方代小程序进行调用',
            86001: '不存在第三方的已经提交的代码',
            85006: '标签格式错误',
            85007: '页面路径错误',
            85008: '类目填写错误',
            85009: '已经有正在审核的版本',
            85010: 'item_list有项目为空',
            85011: '标题填写错误',
            85023: '审核列表填写的项目数不在1-5以内',
            85077: '小程序类目信息失效（类目中含有官方下架的类目，请重新选择类目）',
            86002: '小程序还未设置昵称、头像、简介。请先设置完后再重新提交。',
            85085: '近7天提交审核的小程序数量过多，请耐心等待审核完毕后再次提交',
            85012: '无效的审核id',
            85019: '没有审核版本',
            85020: '审核状态未满足发布',
            85021: '状态不可变',
            85022: 'action非法',
            99999: '未知',
          };

          const data = act.payload.data;

          let result = {
            code: 0,
            message: '审核通过',
          };
          for (let i in data) {
            if (data[i].errcode !== 0) {
              result = {
                code: data[i].errcode,
                message: code[data[i].errcode]
                  ? code[data[i].errcode]
                  : code[99999],
              };
            }
          }

          const { onChange } = this.props;
          onChange && onChange(result, code);
          form.resetFields();
          this.setState({ modalVisible: false, confirmLoading: false });
        });
    });
  }

  handleModalCancel() {
    this.setState({ modalVisible: false });
  }

  render() {
    const { info } = this.props;

    return (
      <Col span={16} offset={6}>
        {info && info.audit === 0 ? <Button disabled>审核通过</Button> : null}
        {info && info.audit === 1 ? (
          <Button type="primary" onClick={this.handleAuditBtnClick}>
            提交
          </Button>
        ) : null}
        {info && info.audit === 2 ? <Button disabled>审核中</Button> : null}
        {info && info.audit === 3 ? (
          <Button type="primary" onClick={this.handleAuditBtnClick}>
            提交
          </Button>
        ) : null}

        <Modal
          title="提交审核"
          visible={this.state.modalVisible}
          confirmLoading={this.state.confirmLoading}
          okText="提交"
          onOk={this.handleModalOk}
          cancelText="取消"
          onCancel={this.handleModalCancel}
        >
          <AuditForm ref={this.bindFormRef} />
        </Modal>
      </Col>
    );
  }
}

AuditCol.propTypes = {
  codeCommit: PropTypes.func.isRequired,
  auditStatus: PropTypes.func.isRequired,
  info: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    info: state.miniprogram.info,
  };
}

export default connect(mapStateToProps, { codeCommit, auditStatus })(AuditCol);
