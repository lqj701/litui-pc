import { login } from './auth';
import { getRecentContactList } from './recent-contact-list';
import sendCommonMsg from './msg/send-common-msg';
import { getLastC2CHistoryMsgs } from './msg/get-history-msg';

let loginResolve;
const loginPromise = new Promise((resolve => {
  loginResolve = resolve;
}));

function ensureLogin(cb) {
  return (opts) => loginPromise.then(() => cb(opts));
}

export default {
  login: opts => login(opts).then((resp) => loginResolve(resp)),
  getRecentContactList: ensureLogin(getRecentContactList),
  sendCommonMsg: ensureLogin(sendCommonMsg),
  getLastC2CHistoryMsgs: ensureLogin(getLastC2CHistoryMsgs),
};
