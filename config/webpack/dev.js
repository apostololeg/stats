const webpack = require('webpack');
const merge = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const common = require('./common');
const paths = require('../paths');
const { PROTOCOL, HOST, SERVER_PORT, DEV_PORT } = require('../const.js');

const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const proxyConfig = {
  secure: false,
  changeOrigin: true,
  logLevel: 'debug',
  target: `${PROTOCOL}${HOST}:${SERVER_PORT}/`,
};

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new ReactRefreshWebpackPlugin(),
];

if (process.env.ANALYZE) {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = merge(common, {
  mode: 'development',
  output: {
    publicPath: '/',
  },
  plugins,
  devtool: 'source-map',
  devServer: {
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Max-Age': '3600',
      'Access-Control-Allow-Headers': 'Content-Type, Cookie',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    },
    static: paths.build,
    compress: true,
    historyApiFallback: true,
    port: DEV_PORT,
    proxy: {
      '/api': proxyConfig,
    },
  },
});
