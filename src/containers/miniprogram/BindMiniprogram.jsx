import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Steps, Button, Modal } from 'antd';
import { connect } from 'react-redux';
import { fetchAuthUrl, mpManagementIno } from '../../actions/miniprogram';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 640px;
  margin: 60px
`;

const SpaceLine = styled.div`
  width: 640px;
  margin-top: 24px;
  margin-bottom: 22px;
  border: 1px dashed #E9E9E9;
`;

const Section = styled.div`
  margin-bottom: 16px;
  
  &:nth-last-child(){
    margin-bottom: 20px;
  }
`;

const Text = styled.div`
  font-size: 14px;
  color: rgba(0,0,0,0.85);
  margin-bottom: 4px;
`;

const TextGrey = styled.div`
  font-size: 14px;
  color: rgba(0,0,0,0.45);
`;

const Step = Steps.Step;

class BindMiniprogram extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentStage: window.localStorage.getItem('HAS_MP') === 'TRUE' ? 1 : 0,
    };
    this.openAuthPage = this.openAuthPage.bind(this);
    this.goForward = this.goForward.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {

  }

  openAuthPage() {
    const url = `${window.location.origin}/wx/${AppConf.appId}/h5/settings/miniprogram?corpId=${AppConf.corpId}&agentId=${AppConf.agentId}&userToken=${AppConf.api.userToken}`;

    this.props.fetchAuthUrl({
      orgId: AppConf.orgId,
      redirectUri: window.btoa(url),
    })
      .then((res) => {
        if (res.payload.code === 0) {
          window.location.href = this.props.authUrl;
        }
        if (res.payload.code === 2011) {
          Modal.error({
            title: '',
            content: '微信授权不完整，请授予全部的开发管理、账号信息权限',
          });
        }
      });
  }

  goForward() {
    this.setState({
      currentStage: 1
    });
    window.localStorage.setItem('HAS_MP', 'TRUE');
  }

  goBack() {
    this.setState({
      currentStage: 0
    });
    window.localStorage.setItem('HAS_MP', 'FALSE');
  }

  render() {

    const stage0 =
      <div style={{ marginTop: '40px' }}>
        <Text>励推名片可以在微信生态里快速产生人脉裂变，以最短的时间，最高的效率获取最多的客户。企业小程序需要为自己的企业注册一个微信小程序，这样企业就可以拥有自己独一无二的获客利器。</Text>
        <SpaceLine />
        <div style={{ paddingBottom: '6px' }}>
          <Section>
            <Text>若是已有认证过的公众号，查看：<a target="_blank" rel="noopener noreferrer" href="https://www.kancloud.cn/weiwenjia_litui/help/711986">小程序复用公众号资质快速认证</a></Text>
          </Section>
          <Section>
            <Text>若是没有认证过的公众号/小程序，查看：<a target="_blank" rel="noopener noreferrer" href="https://www.kancloud.cn/weiwenjia_litui/help/711988">小程序申请与认证</a></Text>
            <TextGrey>小程序认证时间大概为1~3天</TextGrey>
          </Section>
          <Section>
            <Text>若有问题，可以查看：<a target="_blank" rel="noopener noreferrer" href="https://www.kancloud.cn/weiwenjia_litui/help/711908">小程序注册帮助文档</a></Text>
            <TextGrey>1. 只能使用企业主体的营业执照注册企业小程序。</TextGrey>
            <TextGrey>2. 申请完小程序之后请务必补充小程序信息</TextGrey>
          </Section>
          <Section>
            <Text>若是想要了解励推，可以查看：<a target="_blank" rel="noopener noreferrer" href="https://www.kancloud.cn/weiwenjia_litui/help/711885">励推使用技巧</a></Text>
          </Section>
        </div>
        <Button type="primary" onClick={this.goForward} >我已有小程序</Button>
      </div>;

    const stage1 =
      <div style={{ marginTop: '40px' }}>
        <div style={{ paddingBottom: '6px' }}>
          <Section>
            <Text>申请完小程序后需要在此进行小程序授权</Text>
            <TextGrey>1.若是小程序信息为空，提交审核将直接失败，需要补充，查看：<a target="_blank" rel="noopener noreferrer" href="https://www.kancloud.cn/weiwenjia_litui/help/714979">补充小程序信息</a></TextGrey>
            <TextGrey>2.若是小程序没有授权开发权限，提交审核将直接失败，需要重新授权，查看：<a target="_blank" rel="noopener noreferrer" href="https://www.kancloud.cn/weiwenjia_litui/help/711985">小程序授权励推</a></TextGrey>
          </Section>
          <Section>
            <Text>授权后提交审核，微信官方将会对小程序发布审核，审核时间大概为1~3天</Text>
          </Section>
          <Section>
            <Text>若是想要了解励推，可查看：<a target="_blank" rel="noopener noreferrer" href="https://www.kancloud.cn/weiwenjia_litui/help/711885">励推使用技巧</a></Text>
          </Section>
        </div>

        <Button style={{ marginRight: '10px' }} onClick={this.goBack} >返回</Button>
        <Button type="primary" onClick={this.openAuthPage} >小程序授权</Button>
        <Text style={{ display: 'inline-block', marginLeft: '10px' }}>授权成功后请刷新该页面</Text>
      </div>;

    return (
      <Wrapper>
        <Content>
          <Steps current={this.state.currentStage}>
            <Step title="小程序申请" content="" />
            <Step title="小程序授权" />
          </Steps>

          {this.state.currentStage === 0 && stage0}
          {this.state.currentStage === 1 && stage1}
        </Content>
      </Wrapper>
    );
  }
}

BindMiniprogram.propTypes = {
  fetchAuthUrl: PropTypes.func.isRequired,
  mpManagementIno: PropTypes.func.isRequired,
  authUrl: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    authUrl: state.miniprogram.authUrl,
    miniprogramInfo: state.miniprogram.miniprogramInfo,
  };
}

export default connect(mapStateToProps, { fetchAuthUrl, mpManagementIno })(BindMiniprogram);
