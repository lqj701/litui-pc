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
          domain: 'https://staging-yingid.ikcrm.com',
          domains: {
            biz: 'https://staging-yingid.ikcrm.com',
            im: 'https://staging-im.ikcrm.com',
          },
          pathPrefix: '/',
          userToken: '$\{userToken}',
          accessToken: '$\{accessToken?if_exists}'
        },
        im: {
          sdkAppID: 1400082675,
          accountType: 24948,
        }
      };
    </script>
  `,
};
