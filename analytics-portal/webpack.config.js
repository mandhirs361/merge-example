const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { ModuleFederationPlugin } = webpack.container;
const deps = require('./package.json').dependencies;

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const PORT = 3000;
const MIS_REMOTE_URL = process.env.MIS_REMOTE_URL || 'http://localhost:3001/remoteEntry.js';

module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    mode: argv.mode || 'development',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    output: {
      publicPath: 'auto',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    devServer: {
      port: PORT,
      historyApiFallback: true,
      hot: true,
      open: true,
      static: { directory: path.resolve(__dirname, 'public') },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'analytics_portal',
        remotes: {
          // `name@url` — the URL is resolved at runtime, so republishing
          // analytics-portal-mis is enough for the host to pick up its changes.
          analytics_portal_mis: `analytics_portal_mis@${MIS_REMOTE_URL}`,
        },
        shared: {
          react: { singleton: true, requiredVersion: deps.react },
          'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        },
      }),
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new webpack.DefinePlugin({
        'process.env.MIS_REMOTE_URL': JSON.stringify(MIS_REMOTE_URL),
      }),
    ],
  };
};
