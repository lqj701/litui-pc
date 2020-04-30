import webim from './webim';
import { setLoginInfo } from './config';

export function login({ loginInfo, listeners }) {
  return new Promise((resolve => {
    webim.login(setLoginInfo(loginInfo), listeners, { isLogOn: false }, () => {
      resolve(true);
    });
  }));
}
