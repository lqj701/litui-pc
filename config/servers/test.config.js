module.exports = {
  buildPath: '/h5_pc_assets/',
  publicPath: '/h5_pc_assets/',
  appConf: `
    <script>
      window.AppConf = {
        corpName: '$\{corpName}',
        avatar: '$\{avatar}',
        corpId: '$\{corpId}',
        agentId: $\{agentId},
        appId: $\{appId},
        orgId: $\{orgId},
        userId: $\{userId},
        usable: $\{usable?c},
        userRole: $\{userRole},
        qiyiehaoQrCode: '$\{qiyiehaoQrCode}',
        accountExpiredAt: $\{accountExpiredAt},
        mpType: '$\{mpType}',
        accountVersion: '$\{accountVersion}',
        api: {
          domain: 'https://test-yingid.ikcrm.com',
          domains: {
            biz: 'https://test-yingid.ikcrm.com',
            im: 'https://test-im.ikcrm.com',
          },
          pathPrefix: '/',
          userToken: '$\{userToken}',
          accessToken: '$\{accessToken?if_exists}'
        },
        im: {
          sdkAppID: 1400081518,
          accountType: 24947,
        }
      };
    </script>
  `
};
