const path = require('path');
const fs = require('fs');
const localJsonFilePath = path.resolve(__dirname, 'local.json');

let localJson;

if (fs.existsSync(localJsonFilePath)) {
  localJson = JSON.parse(fs.readFileSync(localJsonFilePath, 'utf8'));
} else {
  localJson = {
    userToken: '017753edf7ad47e8ab83f92697ded523'
  };
}

module.exports = {
  buildPath: '/',
  publicPath: '/',
  appConf: `
    <script>
      window.AppConf = {
        corpName: 'stbui',
        avatar: '',
        corpId: 'wx22be5ede0602e7a8',
        agentId: '1000202',
        appId: 1,
        orgId: 1,
        userId: 26,
        usable: true,
        userRole: 1,
        fragment: 'Hawkeye',
        accountExpiredAt: +new Date() + 604800000,
        mpType: '2',
        accountVersion: '2',
        api: {
          domain: 'https://dev-yingid.ikcrm.com',
          domains: {
            im: 'https://dev-im.ikcrm.com',
          },
          pathPrefix: '/',
          userToken: '017753edf7ad47e8ab83f92697ded523',
          salesToken: '96e35eedfdff41a0882d389f58149ff1',
          // accessToken: 'ec6629dda00341fba291b473a9d23d56',
        },
        jsapiConfig:{ 
          noncestr: '73b8be80e332487cb52e27e6fc45662e',
          timestamp: '1532937406',
          signature: '23edf4efb8a8294ba040c232af07e8564cef86d7'
        },
        im: {
          sdkAppID: 1400077744,
          accountType: 24256,
        }
      };
    </script>
  `
};
