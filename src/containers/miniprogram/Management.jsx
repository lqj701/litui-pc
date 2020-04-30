import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Col, Row, Button, Card, Modal } from 'antd';
import {
  fetchInfo,
  getWxQrcode,
  auditStatus,
  releaseStatus,
  codeCommit,
  pushVersionInfo
} from '../../actions/miniprogram';
import { formatDate } from '../../utils/utils';

const Header = styled.h1`
  position: relative;
  display: flex;
  margin-bottom: 0;
  font-size: 20px;
  height: 45px;
  line-height: 45px;
`;

const Title = styled.span`
  padding-right: 60px;
`;

const Divider = styled.div`
  border-top: 1px dashed #ddd;
  height: 1px;
  margin: 40px 0;
`;

const Wrapper = styled.div`
  .ant-row {
    margin-bottom: 20px;
  }

  .ant-card {
    height: 65vh;
  }
`;

const QrCodeContainer = styled.div`
  position: absolute;
  right: 30px;
  top: 250px;
`;

class Management extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrcode: '',
      status: this.getStatusProps(props),
      message: '',
      isSubmit: false
    };
  }

  getStatusProps(props) {
    if ('info' in props && props.info) {
      return props.info.audit_status;
    }

    return -1;
  }

  componentDidMount() {
    this.props.fetchInfo({
      orgId: AppConf.orgId
    });
  }

  handleAuditBtnClick = () => {
    const { info } = this.props;

    if (info.nickname === '') {
      Modal.error({
        title: '',
        content: '请先在微信公众平台补充小程序名称',
      });
      return;
    }

    if (info.serviceCategory.length === 0) {
      Modal.error({
        title: '',
        content: (
          <div>请先在微信公众平台补充服务类目，详细可见：<a target="_blank" rel="noopener noreferrer" href="https://www.kancloud.cn/weiwenjia_litui/help/714979">小程序信息填写</a></div>
        ),
      });
      return;
    }

    this.setState({ isSubmit: true });
    this.props
      .codeCommit({
        orgId: AppConf.orgId
      })
      .then(act => {
        if (!act.payload || act.payload.code === 0) {
          this.setState({ status: 0, message: '审核成功', isSubmit: false });
        } else if (!act.payload || act.payload.code === 2) {
          this.setState({ status: 2, message: '审核中', isSubmit: false });
        } else if (!act.payload || act.payload.code === 3) {
          this.setState({ status: 3, message: '', isSubmit: false });
        } else if (!act.payload || act.payload.code === 1) {
          this.setState({ status: 1, message: '审核失败', isSubmit: false });
        } else {
          this.setState({
            status: 1,
            message: act.payload.message,
            isSubmit: false
          });
        }
      });
  };

  renderQrcode() {
    const { status } = this.state;
    const qrcode = `${AppConf.api.domain}/auth/${AppConf.orgId}/mp/qrcode`;
    if (status === 0) {
      return (
        qrcode && (
          <QrCodeContainer>
            <img src={qrcode} alt="小程序码" width="250px" />
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <a
                className="ant-btn"
                href={"javascript:window.open('" + qrcode + "')"}
              >
                下载
              </a>
            </div>
          </QrCodeContainer>
        )
      );
    }
  }

  renderButton() {
    const { status, isSubmit } = this.state;

    if (status !== 2 && status !== 0) {
      return (
        <Button
          type="primary"
          disabled={isSubmit}
          onClick={this.handleAuditBtnClick}
        >
          提交微信审核
        </Button>
      );
    }
  }

  renderStatusText(state) {
    let text;
    switch (state) {
    case 0:
      text = '审核成功';
      break;
    case 1:
      text = '审核失败';
      break;
    case 2:
      if (!this.props.info.isFirst) {
        text = '审核成功';
      } else {
        text = '审核中';
      }
      break;
    case 3:
      if (!this.props.info.isFirst) {
        text = '审核成功';
      } else {
        text = '未提交';
      }
      break;
    }

    return text;
  }

  renderExamine(info) {
    if (info) {
      const text = this.renderStatusText(this.state.status);

      if (this.state.status === 1) {
        return `${text}：${
          info.reason
        }<br><a target="blank" href="https://www.yuque.com/richard_d/litui/sr3uo3">获得提审建议</a>`;
      }

      return text;
    }
  }

  renderServiceCategory(info) {
    let text = '';
    if (info && info.serviceCategory instanceof Array) {
      info.serviceCategory.forEach(cate => {
        text += `${cate.first_class}/${cate.second_class}    `;
      });

      return text;
    }
  }

  componentWillReceiveProps(nexProps) {
    if ('info' in nexProps) {
      this.setState({
        status: nexProps.info.auditStatus,
        // status: 3,
        message: nexProps.info.reason
      });
    }
  }

  render() {
    const { info } = this.props;

    return (
      <Wrapper>
        <Header>
          <Title>小程序管理</Title>
          <span style={{ flex: '1 1 1e-09px' }} />
          {this.renderButton()}
        </Header>
        <Card>
          <Row>
            <Col sm={4}>
              <strong>小程序信息</strong>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>小程序名称</Col>
            <Col>{info && info.nickname}</Col>
          </Row>
          <Row>
            <Col sm={4}>小程序主体名称:</Col>
            <Col>{info && info.principalName}</Col>
          </Row>
          <Row>
            <Col sm={4}>服务类目:</Col>
            <Col>{this.renderServiceCategory(info)}</Col>
          </Row>

          <Divider />

          <Row>
            <Col sm={4}>
              <strong>版本信息</strong>
            </Col>
          </Row>

          <Row>
            <Col sm={4}>当前版本:</Col>
            <Col>
              {info && !info.isFirst ? info.versionNumber : ` 暂无已发布版本`}
            </Col>
          </Row>

          <Row>
            <Col sm={4}>审核时间:</Col>
            <Col>
              {info && !info.isFirst ? formatDate(info.auditSuccessAt) : ''}
            </Col>
          </Row>
          <Row>
            <Col sm={4}>审核状态:</Col>
            <Col
              sm={20}
              dangerouslySetInnerHTML={{ __html: this.renderExamine(info) }}
            />
            <Col sm={4}></Col>
            <Col sm={20} style={{ marginTop: '8px' }}><a target="_blank" rel="noopener noreferrer" href="https://www.kancloud.cn/weiwenjia_litui/help/712006">获得提审建议</a></Col>
          </Row>

          {/* {this.renderQrcode()} */}
        </Card>
      </Wrapper>
    );
  }
}

Management.propTypes = {
  fetchInfo: PropTypes.func.isRequired,
  conf: PropTypes.object.isRequired,
  info: PropTypes.object,
  auditStatus: PropTypes.func,
  getWxQrcode: PropTypes.func,
  releaseStatus: PropTypes.func,
  pushVersionInfo: PropTypes.func,
  codeCommit: PropTypes.func,
  authorization: PropTypes.object
};

function mapStateToProps(state) {
  return {
    conf: state.conf,
    info: state.miniprogram.info,
    authorization: state.miniprogram.authorization
  };
}

export default connect(
  mapStateToProps,
  {
    fetchInfo,
    getWxQrcode,
    auditStatus,
    codeCommit,
    releaseStatus,
    pushVersionInfo
  }
)(Management);
