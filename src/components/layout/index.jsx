import React from 'react';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const StyledHeader = styled(Header)`
  display: flex;
  color: #fff;
`;

function setCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = '; expires=' + date.toGMTString();
  } else {
    var expires = '';
  }
  document.cookie = name + '=' + value + expires + '; path=/';
}
function deleteCookie(name) {
  setCookie(name, '', -1);
}

const mpType = window.AppConf.mpType;
const isExpired = window.AppConf.accountExpiredAt < +new Date();
const { accountVersion } = window.AppConf;

let shop = [
  {
    name: '商城管理',
    icon: 'appstore',
    children: [
      {
        name: '商城设置',
        path: '/shopping/setting'
      },
      {
        name: '商品管理',
        path: '/shopping/product'
      },
      {
        name: '订单管理',
        path: '/shopping/order'
      }
    ]
  }
];

let mp = [
  {
    name: '小程序管理',
    icon: 'hdd',
    children: [
      {
        name: '小程序绑定',
        path: '/miniprogram'
      },
      {
        name: '默认名片',
        path: '/cards/list'
      },
      {
        name: '活动推广',
        path: '/wx-moments-list'
      },
    ]
  }
];

let compay = [
  {
    name: '公司管理',
    icon: 'inbox',
    path: '/settings/department-and-user'
  }
];

let home = [
  {
    name: '首页',
    icon: 'home',
    path: '/settings/home'
  }
];

let data = [...home];
if (isExpired) {
  data = home;
} else {
  if (accountVersion == '0') {
    data = [...home, ...compay];
  } else if (accountVersion == '1') {
    data = [...home, ...compay, ...mp];
  } else if (accountVersion == '2') {
    data = [...home, ...compay, ...mp, ...shop];
  }

  // if (mpType != '0') {
  //   data = [...home, ...compay, ...mp, ...shop];
  // } else {
  //   data = [...home, ...compay];
  // }
}

class SiderNavigaiton extends React.Component {
  state = {
    currentSeletedMenu: this.props.location.pathname
  };

  getSelectedMenuKeys = () => {
    const {
      location: { pathname }
    } = this.props;
    return [pathname];
  };

  getOpenMenuKeys = () => {
    return data.find(item => this.getOpenMenuKeys[0] == item.path);
  };

  handleLogoutClick = e => {
    deleteCookie('userToken');
    window.location.href = 'https://www.weiwenjia.com/litui';
  };

  render() {
    const { children } = this.props;

    let selectedKeys = this.getSelectedMenuKeys();

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <StyledHeader>
          <div>
            <img src={AppConf.avatar} width="32px" />
            {AppConf.corpName}
          </div>
          <span style={{ flex: '1 1 1e-09px' }} />
          <a
            target="blank"
            href="https://www.kancloud.cn/weiwenjia_litui/help/711885"
            style={{ color: '#fff' }}
          >
            帮助中心
          </a>

          <a
            onClick={this.handleLogoutClick}
            style={{ color: '#fff', paddingLeft: 20 }}
          >
            退出
          </a>
        </StyledHeader>
        <Layout>
          <Sider>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['/settings/home']}
              selectedKeys={selectedKeys}
            >
              {data.map((item, key) => {
                if (item.path) {
                  return (
                    <Menu.Item key={item.path}>
                      <Link to={item.path}>
                        <Icon type={item.icon} />
                        <span>{item.name}</span>
                      </Link>
                    </Menu.Item>
                  );
                } else {
                  return (
                    <SubMenu
                      key={key}
                      title={
                        <span>
                          <Icon type={item.icon} />
                          {item.name}
                        </span>
                      }
                    >
                      {item.children &&
                        item.children.map(child => {
                          return (
                            <Menu.Item key={child.path}>
                              <Link to={child.path}>{child.name}</Link>
                            </Menu.Item>
                          );
                        })}
                    </SubMenu>
                  );
                }
              })}
            </Menu>
          </Sider>
          <Layout
            style={{
              padding: 'padding: 23px 23px 0 23px',
              backgroundColor: 'rgb(236,239,242)'
            }}
          >
            <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(SiderNavigaiton);
