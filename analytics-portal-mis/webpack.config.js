const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

const PORT = 3001;

module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    mode: argv.mode || 'development',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    output: {
      // `auto` resolves chunk URLs against the remoteEntry location, so the host
      // pulls this remote's chunks from :3001 instead of from its own origin.
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
      // The host runs on a different origin, so remoteEntry.js must be CORS-readable.
      headers: { 'Access-Control-Allow-Origin': '*' },
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
        name: 'analytics_portal_mis',
        filename: 'remoteEntry.js',
        exposes: {
          './MisDashboard': './src/components/MisDashboard.jsx',
          './KpiCard': './src/components/KpiCard.jsx',
          './RevenueTable': './src/components/RevenueTable.jsx',
          './misService': './src/services/misService.js',
        },
        shared: {
          react: { singleton: true, requiredVersion: deps.react },
          'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        },
      }),
      new HtmlWebpackPlugin({ template: './public/index.html' }),
    ],
  };
};
