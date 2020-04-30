import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { syncOrg, fetchSyncOrgProgress } from '../../actions/department';
import styled from 'styled-components';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import Modal from 'antd/lib/modal';
import 'antd/lib/modal/style/css';
import Row from 'antd/lib/row';
import 'antd/lib/row/style/css';
import Col from 'antd/lib/col';
import 'antd/lib/col/style/css';
import Alert from 'antd/lib/alert';
import 'antd/lib/alert/style/css';
import Progress from 'antd/lib/progress';
import 'antd/lib/progress/style/css';

const BtnCol = styled(Col)`
  text-align: right;
`;

const SyncTip = styled.div`
  display: flex;
`;

const SyncTipLeft = styled.div`
  width: 30px;
`;

const SyncTipRight = styled.div`
  flex: 1;
`;

const ProgressContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

class SyncOrg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      syncOrgProgress: 0,
      syncOrgStatus: 0,
      syncOrgModalVisible: false,
      syncOrgConfirmLoading: false,
    };

    this.handleSyncBtnClick = this.handleSyncBtnClick.bind(this);
    this.handleSyncOrgModalOk = this.handleSyncOrgModalOk.bind(this);
    this.handleSyncOrgModalCancel = this.handleSyncOrgModalCancel.bind(this);
  }

  handleSyncBtnClick() {
    this.setState({ syncOrgModalVisible: true });
  }

  handleSyncOrgModalOk() {
    this.setState({ syncOrgConfirmLoading: true, syncOrgStatus: 1 });

    this.props.syncOrg().then(syncOrgAct => {
      if (syncOrgAct.payload.code === 101104) {
        this.setState({ syncOrgConfirmLoading: false, syncOrgStatus: -2 });
        if (this.props.onSyncDone) this.props.onSyncDone();
        return;
      }

      if (!syncOrgAct.payload.data.taskId) {
        this.setState({ syncOrgConfirmLoading: false, syncOrgStatus: -1 });
        return;
      }

      const interval = window.setInterval(() => {
        this.props.fetchSyncOrgProgress({ taskId: syncOrgAct.payload.data.taskId }).then(syncOrgProgressAct => {
          const progress = syncOrgProgressAct.payload.data.progress;

          if (progress === -1) {
            this.setState({ syncOrgProgress: 0, syncOrgStatus: -1, syncOrgConfirmLoading: false });
            window.clearInterval(interval);
          } else if (progress === 100) {
            this.setState({ syncOrgProgress: 100, syncOrgStatus: 2, syncOrgConfirmLoading: false });
            window.clearInterval(interval);
          } else {
            this.setState({ syncOrgProgress: progress, syncOrgStatus: 1 });
          }
        });
      }, 2000);
    });
  }

  handleSyncOrgModalCancel() {
    const stateOpts = { syncOrgModalVisible: false };

    if (this.state.syncOrgStatus !== 1) {
      stateOpts.syncOrgProgress = 0;
      stateOpts.syncOrgStatus = 0;
    }

    this.setState(stateOpts);
  }

  render() {
    const tip = (
      <SyncTip>
        <SyncTipLeft>注：</SyncTipLeft>
        <SyncTipRight>
          <p>1、建议企业微信管理员先将需要使用励推的部门或者员工加入企业微信的可见范围中。</p>
          <p>2、每天可同步3次组织架构。</p>
          <p>3、两次同步间隔需10分钟。</p>
        </SyncTipRight>
      </SyncTip>
    );

    const { syncOrgStatus, syncOrgProgress, syncOrgModalVisible, syncOrgConfirmLoading } = this.state;

    return (
      <Row>
        <BtnCol>
          <Button type="primary" onClick={this.handleSyncBtnClick}>同步组织架构</Button>
          <Modal
            title="同步组织架构"
            visible={syncOrgModalVisible}
            confirmLoading={syncOrgConfirmLoading}
            okText="同步"
            cancelText="关闭"
            onOk={this.handleSyncOrgModalOk}
            onCancel={this.handleSyncOrgModalCancel}
            width={720}
          >
            <Alert message={tip} type="warning" />
            <ProgressContainer>
              <Progress percent={syncOrgProgress} />
              <p>
                {syncOrgStatus === 0 ? '准备同步' : ''}
                {syncOrgStatus === 1 ? '正在同步...' : ''}
                {syncOrgStatus === 2 ? '同步成功' : ''}
                {syncOrgStatus === -1 ? '同步失败' : ''}
                {syncOrgStatus === -2 ? '超出同步限制，请检查是否间隔少于10分钟或是今天已经同步了3次' : ''}
              </p>
            </ProgressContainer>
          </Modal>
        </BtnCol>
      </Row>
    );
  }
}

SyncOrg.propTypes = {
  syncOrg: PropTypes.func.isRequired,
  fetchSyncOrgProgress: PropTypes.func.isRequired,
  onSyncDone: PropTypes.func,
};

export default connect(null, { syncOrg, fetchSyncOrgProgress })(SyncOrg);
