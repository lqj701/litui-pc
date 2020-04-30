import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import { connect } from 'react-redux';
import { fetchAuthUrl } from '../../actions/miniprogram';

const Wrapper = styled.div`
  flex: 1;
  align-self: center;
  text-align: center;
  margin-top: 150px;
  
  .ant-btn-primary {
    margin-top: 20px;
    padding: 0 80px;
    height: 38px;
    background-color: #2aad19;
    border-color: #2aad19;
    
    &:hover, &:focus {
      background-color: #43ad35;
      border-color: #43ad35;
    }
  }
`;

const Text = styled.div`
  font-size: 18px;
`;

class Unbind extends Component {
  constructor(props) {
    super(props);
    this.openAuthPage = this.openAuthPage.bind(this);
  }

  componentDidMount() {
    const url = `${window.location.origin}/wx/${AppConf.appId}/h5/miniprogram?corpId=${AppConf.corpId}&agentId=${AppConf.agentId}&userToken=${AppConf.api.userToken}`;

    this.props.fetchAuthUrl({
      orgId: AppConf.orgId,
      redirectUri: window.btoa(url),
    });
  }

  openAuthPage() {
    window.location.href = this.props.authUrl;
  }

  render() {
    return (
      <Wrapper>
        <Text>暂未绑定小程序，请先绑定</Text>
        <Button type="primary" onClick={this.openAuthPage}>绑定小程序</Button>
      </Wrapper>
    );
  }
}

Unbind.propTypes = {
  fetchAuthUrl: PropTypes.func.isRequired,
  authUrl: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    authUrl: state.miniprogram.authUrl,
  };
}

export default connect(mapStateToProps, { fetchAuthUrl })(Unbind);
