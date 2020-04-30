module.exports = {
  buildPath: '/h5_pc_assets/',
  publicPath: '/h5_pc_assets/',
  appConf: `
    <script>
      window.AppConf = {
        corpName: '$\{corpName?if_exists}',
        avatar: '$\{avatar?if_exists}',
        corpId: '$\{corpId?if_exists}',
        agentId: $\{agentId?if_exists},
        appId: $\{appId?if_exists},
        orgId: $\{orgId?if_exists},
        userId: $\{userId?if_exists},
        usable: $\{usable?c},
        userRole: $\{userRole?if_exists},
        qiyiehaoQrCode: '$\{qiyiehaoQrCode?if_exists}',
        accountExpiredAt: $\{accountExpiredAt?if_exists},
        mpType: '$\{mpType}',
        accountVersion: '$\{accountVersion}',
        api: {
          domain: 'https://dev-yingid.ikcrm.com',
          domains: {
            biz: 'https://dev-yingid.ikcrm.com',
            im: 'https://dev-im.ikcrm.com',
          },
          pathPrefix: '/',
          userToken: '$\{userToken?if_exists}',
          accessToken: '$\{accessToken?if_exists}'
        },
        im: {
          sdkAppID: 1400077744,
          accountType: 24256,
        }
      };
    </script>
  `,
  servers: [{
    name: '励推 dev 服务器',
    host: 'dev-yingid.ikcrm.com',
    port: 40022,
    username: 'jar',
  }],
  deployTo: '/dyne/jar/dev-yingid.ikcrm.com',
  projectPublicPath: '/dyne/jar/dev-yingid.ikcrm.com/public',
};
