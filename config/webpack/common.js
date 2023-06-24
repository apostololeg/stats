const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const ComponentDirectoryPlugin = require('component-directory-webpack-plugin');
const FaviconWebpackPlugin = require('favicons-webpack-plugin');

const pkg = require('../../package.json');
const paths = require('../paths');
const {
  PRODUCTION,
  PROTOCOL,
  HOST,
  SENTRY_DSN,
  MAPBOX_ACCESS_TOKEN,
} = require('../const');

module.exports = {
  target: 'web',
  entry: [`${paths.client}/index.js`],
  output: {
    path: paths.build,
    publicPath: '/',
    filename: 'js/[name].js?v=[hash:5]',
  },
  resolve: {
    modules: [paths.client, 'node_modules'],
    alias: {
      config: paths.config,
      theme: `${paths.client}/theme.styl`,
      uilib: '@foreverido/uilib',
    },
    // plugins: [new ComponentDirectoryPlugin()],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  optimization: {
    moduleIds: 'named',
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: 'babel-loader',
        include: paths.client,
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          { loader: 'css-modules-typescript-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  ['postcss-preset-env', { stage: 3, autoprefixer: true }],
                ],
              },
            },
          },
          {
            loader: 'stylus-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.svg$/,
        exclude: paths.modules,
        oneOf: [
          {
            issuer: /\.(t|j)sx?$/,
            use: [
              {
                loader: 'babel-loader',
              },
              {
                loader: 'react-svg-loader',
              },
            ],
          },
          {
            loader: 'file-loader',
            options: {
              name: 'static/[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'static/[name].[ext]',
            outputPath: 'images/',
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
      PRODUCTION: JSON.stringify(PRODUCTION),
      PROTOCOL: JSON.stringify(PROTOCOL),
      HOST: JSON.stringify(HOST),
      SENTRY_DSN: JSON.stringify(SENTRY_DSN),
      MAPBOX_ACCESS_TOKEN: JSON.stringify(MAPBOX_ACCESS_TOKEN),
    }),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `${paths.assets}/*.css`,
          to: paths.build,
        },
        {
          from: `${paths.assets}/fonts`,
          to: `${paths.build}/fonts`,
        },
        {
          from: `${paths.assets}/*.svg`,
          to: paths.build,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'Stats',
      filename: 'index.html',
      template: `${paths.assets}/index.html`,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new FaviconWebpackPlugin({
      logo: `${paths.assets}/icon.svg`,
      mode: 'webapp', // optional can be 'webapp' or 'light' - 'webapp' by default
      devMode: 'webapp', // optional can be 'webapp' or 'light' - 'light' by default
      favicons: {
        appName: 'Stats',
        // appDescription: '',
        developerName: 'Oleh Apostol',
        developerURL: null, // prevent retrieving from the nearest package.json
        background: '#fff',
        theme_color: '#1a1a1a',
        display: 'standalone',
        icons: {
          coast: false,
          yandex: false,
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: PRODUCTION ? '[name].[hash].css' : '[name].css',
      chunkFilename: PRODUCTION ? '[id].[hash].css' : '[id].css',
    }),
  ],
};
