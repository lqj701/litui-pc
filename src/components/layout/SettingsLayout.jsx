import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Layout from 'antd/lib/layout';
import 'antd/lib/layout/style/css';
// import { Link } from '../Router';
import { Link } from 'react-router-dom';
import omit from 'lodash/omit';

const { Header, Content } = Layout;
const StyledLayout = styled(Layout)`
  height: 100%;
  
  .ant-layout-header {
    background-color: #f2f2f2;
    padding: 0;
  }
  
  .ant-layout-content {
    background-color: #fff;
    display: flex;
  }
`;

const Tab = styled(opts => <Link {...omit(opts, ['active'])} />)`
  display: inline-block;
  padding: 0 30px;
  color: #333;
  text-decoration: none;
  
  ${props => props.active ? `
    background-color: #359ed8;
    color: #fff;  
  ` : ''};
`;

function SettingsLayout({ children, actived }) {
  return (
    <StyledLayout>
      <Header>
        <Tab to="/settings/home" active={actived === 'home'}>首页</Tab>
        <Tab to="/settings/miniprogram" active={actived === 'miniprogram'}>小程序管理</Tab>
        <Tab to="/settings/department-and-user" active={actived === 'department-and-user'}>部门与用户</Tab>
      </Header>
      <Content>{children}</Content>
    </StyledLayout>
  );
}

SettingsLayout.propTypes = {
  children: PropTypes.any,
  actived: PropTypes.string,
};

SettingsLayout.defaultProps = {
  children: null,
  actived: 'home',
};

export default SettingsLayout;

