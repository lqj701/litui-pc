const path = require('path');
const wc = require('webpack-config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const serverConfig = require(`./config/servers/${process.env.SERVER_ENV}.config`);
const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

module.exports = new wc.Config().extend(`./webpack.${env}.config.js`).merge({
  entry: './src/index',
  mode: process.env.NODE_ENV,
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    path: path.resolve(`./dist${serverConfig.buildPath}`),
    publicPath: serverConfig.publicPath,
  },
  target: 'web',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [{
          loader: 'babel-loader',
          options: { cacheDirectory: true },
        }],
        exclude: /(node_modules)/,
      },
      // {
      //   test: /\.svg$/,
      //   include: [path.resolve('./[project]/assets/svgs'), path.resolve('./core/assets/svgs')],
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //       options: { cacheDirectory: true },
      //     }, {
      //       loader: 'svg-sprite-loader',
      //       options: {
      //         runtimeGenerator: path.resolve('./core/svg-sprite-loader-runtime-generator'),
      //         runtimeOptions: {
      //           iconModule: 'core/components/Icon.jsx',
      //         },
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: path.resolve('./assets/images/favicon.ico'),
      template: path.resolve('./src/index.html'),
      filename: process.env.NODE_ENV === 'development' ? 'index.html' : 'index.ftl',
      inject: 'body',
      ENV: serverConfig,
    }),
  ],
});
