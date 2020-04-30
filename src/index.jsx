import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import Router from './routes';
import { injectGlobal } from 'styled-components';
import ImInit from './utils/Im-init';

import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

import asyncComp from './components/AsyncComp';
const Denied = asyncComp(() => import('./pages/errors/Denied'));
const NumberLimit = asyncComp(() => import('./pages/errors/NumberLimit'));
const Expired = asyncComp(() => import('./pages/errors/Expired'));

injectGlobal`
  *, :after, :before {
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }
  #container {
    height: 100%;
  }
`;

const store = configureStore();

new ImInit({ store });

const RedirectTo = () => {
  const { accountVersion } = window.AppConf;
  if (accountVersion != '0' && AppConf.accountExpiredAt < +new Date()) {
    return <Expired />;
  }

  if (AppConf.userRole !== 1 && AppConf.api.accessToken === '') {
    return <Denied />;
  }

  if (!AppConf.usable) {
    return <NumberLimit />;
  }

  return (
    <Provider store={store}>
      <LocaleProvider locale={zh_CN}>
        <Router />
      </LocaleProvider>
    </Provider>
  );
};

ReactDOM.render(<RedirectTo />, document.getElementById('container'));
