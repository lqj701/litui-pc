import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'antd';
import styled from 'styled-components';
import Management from '../../containers/miniprogram/Management';
import BindMiniprogram from '../../containers/miniprogram/BindMiniprogram';

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

export default class Notes extends Component {
  static propTypes = {};

  state = {
    isNotes: true
  };
  handleButtonClick = () => {
    this.props.upgradeMustKnowSet();
    // window.localStorage.setItem('litui_pc_notes', 1);
    this.setState({ isNotes: false });
  };

  renderManage() {
    return <BindMiniprogram />;
  }

  renderNotes() {
    return (
      <div>
        <Header>
          <Title>小程序</Title>
        </Header>
        <Card>
          <h1>
            <center>绑定企业自有小程序须知</center>
          </h1>
          <div>
            <strong>1. 自有小程序与共享小程序的区别</strong>
          </div>
          <div>
            （1）自有小程序需要企业自己申请的小程序，然后绑定在该企业。自己申请小程序相关可见：
            <a
              href="https://www.kancloud.cn/weiwenjia_litui/help/711908"
              target="_blank"
            >
              励推开通流程
            </a>
          </div>
          <div>
            （2）共有小程序相当于一个平台，所有的企业都在此平台中，用户看到的名片页统一容纳在“励推名片”的小程序内。
            企业小程序相当于企业拥有自己的小程序，可以在微信搜索中直接搜索到企业自己设置的小程序。
          </div>
          <div>
            （3）默认名片是企业自有小程序专属功能，开启默认名片后，没有名片的客户可以在微信搜索入口搜索到企业自有
            小程序，进入后可以看到设置默认名片，防止这一部分客户流失。
          </div>
          <br />
          <br />
          <div>
            <strong>2.共享小程序切换成自有小程序须知</strong>
          </div>
          <div>
            （1）绑定自有小程序需要企业自己申请企业小程序，企业申请的小程序
          </div>
          <div>
            （2）因为共享小程序与自有小程序不兼容，
            <strong>
              共享小程序切换为企业自有小程序获取的客户资料会自动清除
            </strong>
            ，因此希望
          </div>
          <div>您在转换到自有小程序时候做好客户备份</div>
          <div>（3）请注意，共享小程序转换到自有小程序的操作不可逆。</div>

          <br />
          <br />
          <center>
            <Button type="primary" onClick={this.handleButtonClick}>
              我知道了
            </Button>
          </center>
        </Card>
      </div>
    );
  }

  render() {
    return this.state.isNotes ? this.renderNotes() : this.renderManage();
  }
}
