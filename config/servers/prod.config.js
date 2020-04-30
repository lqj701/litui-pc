module.exports = {
  buildPath: "/h5_pc_assets/",
  publicPath: "/h5_pc_assets/",
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
          domain: 'https://e.ailitui.com',
          domains: {
            biz: 'https://e.ailitui.com',
            im: 'https://im.ailitui.com',
          },
          pathPrefix: '/',
          userToken: '$\{userToken}',
          accessToken: '$\{accessToken?if_exists}'
        },
        im: {
          sdkAppID: 1400083317,
          accountType: 25050,
        }
      };
    </script>
  `
};
