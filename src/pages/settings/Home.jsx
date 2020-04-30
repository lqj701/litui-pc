import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAccountInfo } from '../../actions/organization';
import styled from 'styled-components';
import Spin from '../../components/feedback/Spin';
import { format } from 'fecha';
import { Card, Row, Col, Alert } from 'antd';

const Wrapper = styled.div`
  .ant-row {
    margin: 16px 0;
  }
  .ant-card {
    height: 85vh;
  }
`;

const ColorValue = styled.span`
  color: #459df5;
`;

const ColorDate = styled.span`
  padding-left: 10px;
  color: #999;
`;

const Info = styled.div`
  position: absolute;
  background: #f8f8f8;
  top: 0;
  right: 0;
  bottom: 0;
  width: 330px;
  text-align: center;
  padding-top: 30px;
`;
const Divider = styled.div`
  border-top: 1px dashed #ddd;
  height: 1px;
  margin: 40px 0;
`;

const Guide = styled.a`
  position: absolute;
  top: -20px;
  right: 0;
  background: #4a8cf2;
  box-shadow: 0 2px 8px 0 rgba(74, 140, 242, 0.5);
  border-radius: 100px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #ffffff;
  text-align: left;
  display: inline-block;
  padding: 5px 10px;
`;

function calcDays(startTime, endTime) {
  return Math.floor((endTime - startTime) / 1000 / 60 / 60 / 24);
}

const { accountVersion } = window.AppConf;
const isExpired = window.AppConf.accountExpiredAt < +new Date();

const version = () => {
  let text = '';
  switch (accountVersion) {
  case '0':
    text = '试用版';
    break;
  case '1':
    text = '基础付费版';
    break;
  case '2':
    text = '专业付费版';
    break;
  }

  return text;
};

class Home extends Component {

  componentDidMount() {
    this.props.fetchAccountInfo();
    const ticket = window.location.search.substr(1).split('=')[1];
    if (ticket && ticket !== 'undefined' && ticket !== 'null') {
      this.fetchUserInfo(ticket);
    }
  }

  render() {
    const { accountInfo } = this.props;
    let content = null;

    if (!accountInfo) {
      content = <Spin />;
    } else {
      const startAtStr = format(
        new Date(accountInfo.accountStartTime),
        'YYYY-MM-DD'
      );
      const expiredAtStr = format(
        new Date(accountInfo.accountExpiredAt),
        'YYYY-MM-DD'
      );
      const currentTimestamp = new Date().getTime();
      const usedDays =
        calcDays(accountInfo.accountStartTime, currentTimestamp) + 1;
      const leftDays =
        calcDays(currentTimestamp, accountInfo.accountExpiredAt) > 0
          ? calcDays(currentTimestamp, accountInfo.accountExpiredAt)
          : 0;

      content = (
        <Card>
          {accountVersion == '0' &&
            isExpired && (
            <Row>
              <Col sm={12}>
                <Alert
                  showIcon
                  type="info"
                  message="您的试用版已到期，如需继续使用，可以立即联系励推客服"
                  description={
                    <div>
                      <h1>400-618-0177</h1>
                      <h1>400-867-1101</h1>
                    </div>
                  }
                />
              </Col>
            </Row>
          )}

          <Row>
            <Col sm={6}>
              <strong>账号状态</strong>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>账号版本</Col>
            <Col>{version()}</Col>
          </Row>
          <Row>
            <Col sm={6}>使用工号数：</Col>
            <Col>
              <ColorValue>{accountInfo.usableCount}</ColorValue>/
              {accountInfo.totalUsableCount}
            </Col>
          </Row>
          <Row>
            <Col sm={6}>已使用天数：</Col>
            <Col>
              <span style={{ width: 50, display: ' inline-block' }}>
                {usedDays}天
              </span>
              <ColorDate>
                {startAtStr}
                开通
              </ColorDate>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>剩余可用天数：</Col>
            <Col>
              <span style={{ width: 50, display: ' inline-block' }}>
                {leftDays}天
              </span>
              <ColorDate>
                {expiredAtStr}
                截止
              </ColorDate>
            </Col>
          </Row>

          {/* <Divider /> */}

          <Info>
            <Row>
              <Col style={{ textAlign: ' center' }}>
                <strong>企业号二维码</strong>
              </Col>
            </Row>
            <Row>
              <Col>
                <img src={window.AppConf.qiyiehaoQrCode} width="256" />
              </Col>
            </Row>
            <Row>
              <Col>
                微信关注企业号二维码，即可
                <br />
                在微信进入企业微信应用
              </Col>
            </Row>
          </Info>

          {/* <Guide>
            产品引导<Icon type="arrow-right" />
          </Guide> */}
        </Card>
      );
    }

    return (
      <Wrapper>
        {content}
      </Wrapper>
    );
  }
}

Home.propTypes = {
  fetchAccountInfo: PropTypes.func.isRequired,
  accountInfo: PropTypes.object
};

function mapStateToProps(state) {
  return {
    accountInfo: state.organization.accountInfo
  };
}

export default connect(
  mapStateToProps,
  { fetchAccountInfo }
)(Home);
