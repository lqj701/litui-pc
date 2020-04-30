const Config = {
  sdkAppID: AppConf.im.sdkAppID,
  accountType: AppConf.im.accountType,
  accountMode: 0,
};

const loginInfo = {
  sdkAppID: Config.sdkAppID,
  ' ': Config.sdkAppID,
  accountType: Config.accountType,
};

export function getLoginInfo() {
  return Object.assign({}, loginInfo);
}

export function setLoginInfo(opts = {}) {
  Object.assign(loginInfo, opts);
  return Object.assign({}, loginInfo);
}
