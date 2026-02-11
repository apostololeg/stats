const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

require('dotenv').config();
const { DOMAIN, PRODUCTION } = require('../const');

const paths = require('../paths');

console.log('PRODUCTION', PRODUCTION);

class FixIIFEPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('FixIIFE', (compilation, cb) => {
      const file = path.join(paths.root, 'build/sdk/stats.min.js');
      let content = fs.readFileSync(file, 'utf8');
      if (content.startsWith('!(')) {
        content = content.slice(1);
      }
      fs.writeFileSync(file, content);
      cb();
    });
  }
}

module.exports = {
  mode: 'production',
  entry: path.resolve(paths.root, 'sdk/stats.js'),
  output: {
    path: path.resolve(paths.root, 'build/sdk'),
    filename: 'stats.min.js',
  },
  optimization: {
    minimize: true,
    usedExports: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: { negate_iife: false },
          format: { wrap_iife: true },
          mangle: true,
        },
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __STATS_API_URL__: PRODUCTION
        ? JSON.stringify(DOMAIN)
        : JSON.stringify('http://localhost:9990'),
    }),
    new FixIIFEPlugin(),
  ],
};
