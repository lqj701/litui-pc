import React, { Component } from 'react';

export default class sso extends Component {

  constructor() {
    super()
    let testEnv = ''
    if (/dev/.test(document.referrer)) {
      testEnv = 'dev'
    }
    if (/test/.test(document.referrer)) {
      testEnv = 'test'
    }
    if (/staging/.test(document.referrer)) {
      testEnv = 'staging'
    }

    this.state = {
      loginResult: '未登录',
      testEnv, // 当前测试的环境
      env: /dev/.test(window.location) ? 'crm' : 'jxc', // 当前登录的网站
    }
  }

  componentDidMount() {
    const ticket = window.location.search.substr(1).split('=')[1]
    if (ticket && ticket !== 'undefined' && ticket !== 'null') {
      this.fetchUserInfo(ticket)
    }
  }

  fetchUserInfo(ticket) {
    const host = `https://${this.state.testEnv}-yingid.ikcrm.com/api/login/verify?ticket=${ticket}`

    fetch(host, {
      headers: {
        'content-type': 'application/json',
        'dataType': 'json',
      },
      method: 'GET',
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.data.userInfo)
        if (this.state.env === 'crm') {
          this.setState({
            loginResult: `crm 用户 ${data.data.userInfo} 已登录`
          })
        } else {
          this.setState({
            loginResult: `jxc 用户 ${data.data.userInfo} 已登录`
          })
        }
      })
  }

  login = (env, referer) => {
    const appToken = () => {
      switch (true) {
        case env === 'dev' && referer === 'normal_source':
          return 'f6620ff6729345c8b6101174e695d0ab'
        case env === 'dev' && referer === 'ikjxc_website':
          return 'a329426fa9d79d058d1d3812a7e8bdf2'
        case env === 'test' && referer === 'normal_source':
          return 'f6620ff6729345c8b6101174e695d0ab'
        case env === 'test' && referer === 'ikjxc_website':
          return 'a329426fa9d79d058d1d3812a7e8bdf2'
        case env === 'staging' && referer === 'normal_source':
          return 'a329426fa9d79d058d1d3812a7e8bdf2'
        case env === 'staging' && referer === 'ikjxc_website':
          return 'a329426fa9d79d058d1d3812a7e8bdf2'
      }
    }
    window.location = `https://uc-${env}.weiwenjia.com/web/index.html?referer=${referer}&appToken=${appToken()}#/login`
  }

  render() {
    return (
      <div>
        <section style={{ marginBottom: '40px' }}>
          <div>dev环境用</div>
          <button onClick={() => this.login('dev', 'normal_source')}>crm独立版 登录</button>
          <button onClick={() => this.login('dev', 'ikjxc_website')}>jxc独立版 登录</button>
          <div>{this.state.loginResult}</div>
        </section>
        <section style={{ marginBottom: '40px' }}>
          <div>test环境用</div>
          <button onClick={() => this.login('test', 'normal_source')}>crm独立版 登录</button>
          <button onClick={() => this.login('test', 'ikjxc_website')}>jxc独立版 登录</button>
          <div>{this.state.loginResult}</div>
        </section>
        <section>
          <div>staging环境用</div>
          <button onClick={() => this.login('staging', 'normal_source')}>crm独立版 登录</button>
          <button onClick={() => this.login('staging', 'ikjxc_website')}>jxc独立版 登录</button>
          <div>{this.state.loginResult}</div>
        </section >
      </div>
    )
  }
}